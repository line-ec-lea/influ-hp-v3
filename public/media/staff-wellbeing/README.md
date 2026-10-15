# Staff wellbeing films

Exports made directly from the supplied `influ-kickboxing.mp4` and
`influ-video.mp4`. Keep those source files unchanged. The originals are
1920×1080 containers with baked-in letterboxing; removing the bars does not
restore missing detail or make the active picture 1080 pixels tall.

| Page asset | Source | Start | Duration | Picture crop |
| --- | --- | --- | --- | --- |
| `kickboxing.mp4` | `influ-kickboxing.mp4` | 8 seconds | 39.5 seconds | 1920×818 at (0, 130) |
| `eat.mp4` | `influ-video.mp4` | 41 seconds | 16.9166667 seconds | 1920×848 at (0, 116) |
| `toast.mp4` | `influ-video.mp4` | 57.9166667 seconds | 1.7916667 seconds | 1920×848 at (0, 116) |

The boxing loop starts with the wider training shot and ends before the
black outro. Meal and toast clips stay within the restaurant footage, with
the cut between them at the original toast shot. Playback speed remains 24 fps.

FFmpeg export options: `-map 0:v:0 -an -vf crop=W:H:X:Y,setsar=1
-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart`.
Use the start/duration above with `-ss` before the input and `-t` on the output.
No upscaling, sharpening, generated frames, or color changes were applied.

Posters are taken from each exported clip at 0.5 seconds (`-frames:v 1 -q:v 2`).
The desktop backdrop fills the screen. The mobile frame uses a 4:3 shape to
reduce enlargement and keep more of the wide scene visible; posters and films
use the same frame.

## Balance-ball background film

`balance-ball.mp4` uses the full supplied
`INFUL様　　バランスボール [keqX6whV2mY].mkv` (395 frames, approximately
16.46 seconds). It retains the original 1920×1080 framing and 24 fps, with no
crop, upscaling, speed changes, or color changes. The source is AV1 with Opus
audio; the browser export is silent H.264 High Level 4.1, yuv420p, with faststart.

Export options: `-map 0:v:0 -an -vf setsar=1 -c:v libx264 -preset slow
-crf 20 -profile:v high -level:v 4.1 -refs 4 -pix_fmt yuv420p -movflags +faststart`.
`balance-ball-poster.jpg` is extracted from the export at 0.5 seconds with
`-frames:v 1 -q:v 2`.

The shared fixed video stage crossfades from kickboxing to balance ball halfway
through the physical-health horizontal story (or when the second panel is reached
on mobile). Balance ball continues behind the learning chapter as background atmosphere;
it is not footage of the 忍体心操術 workshop. The meal
film enters with a diagonal transition for the social chapter; the toast film plays
behind its closing links and the footer. Inactive films pause. The existing hero
keeps its original framing; after the hero, all films fill the viewport.

The stage retains silent looping, lazy loading, hidden-tab/page-suspension pauses,
reduced-motion posters, and playback-error fallback. A pause/resume control appears
after the hero. With JavaScript disabled, the kickboxing poster remains visible and
all three chapters remain readable in normal document flow.

Photo galleries are no longer rendered. The earlier image exports remain here as
source assets:

- `wellbeing-move.jpg`: extracted from `influ-kickboxing.mp4` at 34 seconds,
  with the boxing picture crop above and `-frames:v 1 -q:v 2`.
