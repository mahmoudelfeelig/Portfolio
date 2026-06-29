# Project preview assets

The featured-project viewer reads media from this directory. Replace an asset
without changing application code by keeping its filename stable.

## Demo videos

Planora, TypeShift, doompedia, OCPP Demo, and Anubis use browser-optimized MP4
clips with fast-start metadata. Portfolio uses static imagery.

| Project | Filename | Intended sequence |
| --- | --- | --- |
| Planora | `planora.mp4` | Load `small_demo`, solve it, then show the populated schedule. |
| TypeShift | `typeshift.mp4` | Product tour, game flow, and training/replay tools. |
| doompedia | `doompedia.mp4` | Browse cached articles, then filter to a specific result. |
| OCPP Demo | `ocpp-demo.mp4` | Sign in, inspect fleet/station status, then open the live event stream. |
| Anubis | `anubis.mp4` | Navigation into the first interaction and its entry form. |

The matching PNG is used as each video poster and fallback. Portfolio uses
`Portfolio.png` for its recursive zoom, so future screenshots automatically
update every layer.

## Screenshots

- `Portfolio.png`
- `Planora.png`
- `Typeshift.png`
- `Doompedia.png`
- `OCPP-Demo.png`
- `Anubis.png`
