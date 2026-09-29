"use client"

/* eslint-disable functional/immutable-data, @typescript-eslint/no-unsafe-member-access -- OGL exposes mutable shader uniforms and renderer state. */

import { useReducedMotion } from "@company/Motion"
import { Color, Mesh, Program, Renderer, Triangle } from "ogl"
import {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
} from "react"

const PAD = 20

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(
    uShineSize - uShineFade,
    uShineSize + uShineFade + 1e-4,
    phi
  );
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;
  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`

type SpecularButtonProps = {
  children?: ReactNode
  size?: "sm" | "md" | "lg"
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  type?: "button" | "submit" | "reset"
  className?: string
  fullWidth?: boolean
  href?: string
  rel?: string
  target?: string
}

type SpecularCssProperties = CSSProperties & {
  "--sb-radius": string
  "--sb-tint": string
  "--sb-tint-opacity": number
  "--sb-blur": string
  "--sb-text-color": string
}

export default function SpecularButton({
  children = "Get Started",
  size = "lg",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffd700",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 15,
  shineFade = 55,
  thickness = 1,
  speed = 0.3,
  followMouse = true,
  proximity = 250,
  autoAnimate = true,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
  href,
  rel,
  target,
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const fxRef = useRef<HTMLSpanElement | null>(null)
  const propsRef = useRef({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  })
  const shouldReduceMotion = useReducedMotion()

  propsRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  }

  useEffect(() => {
    const button = buttonRef.current
    const fx = fxRef.current
    if (!button || !fx) return

    const isSmallScreen = window.matchMedia("(max-width: 639px)").matches
    if (isSmallScreen) return

    const dpr = window.devicePixelRatio || 1
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 1 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: dpr },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    fx.appendChild(gl.canvas)

    const sizeRef = { width: 1, height: 1 }
    const renderFrame = (angle: number, brightness: number) => {
      const current = propsRef.current
      const line = new Color(current.lineColor)
      const base = new Color(current.baseColor)
      program.uniforms.uAngle.value = angle
      program.uniforms.uRadius.value =
        Math.min(current.radius, Math.min(sizeRef.width, sizeRef.height) / 2) *
        dpr
      program.uniforms.uLineColor.value = [line.r, line.g, line.b]
      program.uniforms.uBaseColor.value = [base.r, base.g, base.b]
      program.uniforms.uIntensity.value = current.intensity * brightness
      program.uniforms.uShineSize.value = (current.shineSize * Math.PI) / 180
      program.uniforms.uShineFade.value = (current.shineFade * Math.PI) / 180
      program.uniforms.uThickness.value = current.thickness * dpr
      renderer.render({ scene: mesh })
    }

    const resize = () => {
      const rect = button.getBoundingClientRect()
      sizeRef.width = rect.width
      sizeRef.height = rect.height
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2)
      program.uniforms.uCenter.value = [
        (PAD + rect.width / 2) * dpr,
        (PAD + rect.height / 2) * dpr,
      ]
      program.uniforms.uHalfSize.value = [
        (rect.width / 2) * dpr,
        (rect.height / 2) * dpr,
      ]
      renderFrame(2.4, shouldReduceMotion ? 0 : Number(autoAnimate))
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(button)
    resize()

    if (shouldReduceMotion) {
      return () => {
        resizeObserver.disconnect()
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    }

    let pointerAngle: number | null = null
    let proximityAmount = 0
    const onPointerMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = Math.max(
        rect.left - event.clientX,
        0,
        event.clientX - rect.right,
      )
      const dy = Math.max(
        rect.top - event.clientY,
        0,
        event.clientY - rect.bottom,
      )
      const distance = Math.hypot(dx, dy)

      pointerAngle = Math.atan2(
        centerY - event.clientY,
        event.clientX - centerX,
      )

      const amount = Math.max(
        0,
        1 - distance / Math.max(propsRef.current.proximity, 1),
      )
      proximityAmount = amount * amount * (3 - 2 * amount)
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let angle = 2.4
    let idleAngle = 2.4
    let brightness = 0
    let previousTime = performance.now()
    let animationFrame = 0
    const update = (time: number) => {
      animationFrame = requestAnimationFrame(update)
      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time
      const current = propsRef.current

      idleAngle += current.speed * delta

      let targetAngle = idleAngle
      if (current.followMouse && pointerAngle !== null && proximityAmount > 0) {
        const steerMix = current.autoAnimate ? proximityAmount * 0.5 : 1
        const pointerOffset =
          ((pointerAngle - idleAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        targetAngle = idleAngle + pointerOffset * steerMix
      }

      const difference =
        ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      angle += difference * (1 - Math.exp(-delta * 4))

      const targetBrightness = current.autoAnimate ? 1 : proximityAmount
      brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 8))
      renderFrame(angle, brightness)
    }
    animationFrame = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [autoAnimate, shouldReduceMotion])

  const cssProperties: SpecularCssProperties = {
    "--sb-radius": `${radius}px`,
    "--sb-tint": tint,
    "--sb-tint-opacity": tintOpacity,
    "--sb-blur": `${blur}px`,
    "--sb-text-color": textColor,
  }
  const sizeClasses = {
    sm: "px-5 py-2.5 text-[0.8125rem] sm:px-[22px] sm:text-[0.85rem]",
    md: "px-5 py-3 text-sm sm:px-[30px] sm:py-[14px] sm:text-base",
    lg: "px-6 py-3.5 text-base sm:px-10 sm:py-[18px] sm:text-[1.15rem]",
  }
  const classes = [
    "relative m-0 inline-grid cursor-pointer place-items-center overflow-visible rounded-[var(--sb-radius)] border border-[#9A7B10] bg-[#111016]/85 font-medium leading-none tracking-[0.01em] text-[var(--sb-text-color)] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)] outline-none backdrop-blur-[var(--sb-blur)] transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color-mix(in_srgb,var(--sb-text-color)_60%,transparent)] aria-disabled:cursor-default aria-disabled:opacity-55 disabled:cursor-default disabled:opacity-55 disabled:active:scale-100 sm:border-transparent sm:bg-[color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)*100%),transparent)] motion-reduce:transition-none motion-reduce:active:scale-100",
    sizeClasses[size],
    fullWidth ? "w-full" : "w-fit max-w-full",
    className,
  ]
    .filter(Boolean)
    .join(" ")
  const content = (
    <>
      <span
        ref={fxRef}
        className="pointer-events-none absolute -inset-5 z-[1] overflow-hidden rounded-[calc(var(--sb-radius)+20px)] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
        aria-hidden
      />
      <span className="relative z-[2] inline-flex min-w-0 max-w-full items-center justify-center text-center break-words">
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        ref={(node) => {
          buttonRef.current = node
        }}
        href={href}
        target={target}
        rel={rel}
        className={classes}
        style={cssProperties}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={(node) => {
        buttonRef.current = node
      }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      style={cssProperties}
    >
      {content}
    </button>
  )
}
