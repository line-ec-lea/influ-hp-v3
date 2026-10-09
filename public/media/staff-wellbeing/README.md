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
