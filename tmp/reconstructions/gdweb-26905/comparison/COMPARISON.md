# gdweb-26905 Reconstruction Comparison

## Scope

- Target: 우리금융경영연구소 기후금융포털
- Evidence: `gdweb-26905` desktop 5 tiles and mobile 1 tile
- Reconstruction: semantic HTML, responsive CSS, and JavaScript interactions
- Desktop comparison viewport: 1200px
- Mobile implementation viewport: 390px

## Geometry

| Measurement | Evidence | Reconstruction | Difference |
| --- | ---: | ---: | ---: |
| Desktop width | 1200px | 1200px | 0px |
| Desktop height | 6935px | 6783px | -152px (-2.2%) |
| Primary section count | 7 | 7 | 0 |
| Primary section order | hero → news → research → emissions → market → media → footer | same | match |

Reconstruction section boundaries:

| Section | Top | Height |
| --- | ---: | ---: |
| Hero | 0px | 770px |
| News | 770px | 1458px |
| Research | 2228px | 1214px |
| Emissions | 3442px | 780px |
| Market | 4222px | 1383px |
| Media | 5605px | 878px |
| Footer | 6483px | 300px |

## Matched

- Transparent navigation over a misty forest hero
- English hero heading, search field, keyword chips, and 2×2 portal navigation
- Translucent current-content rail at the bottom of the hero
- Four default news rows with summaries and a separate load-more row
- Feature-led research grid with report cover and supporting research items
- Full-width black greenhouse-gas band with Earth imagery
- Case study, campaign/people, lecture/media, and black footer sequence
- High-level white/dark section rhythm and thin rule system

## Deviations

- Original logo files, typefaces, copy, videos, and photography were not available. Generated visual assets and system fonts replace them.
- Exact colors and pixels are inferred from prepared JPEG evidence, so JPEG compression and resizing affect sampled values.
- The Earth image composition and individual card artwork are visually analogous rather than source-identical.
- The evidence document for this run is a smoke-level placeholder. Page sections and geometry were supplemented from the evidence images.
- The 243×1404 mobile evidence is a scaled desktop composition, not a responsive mobile capture. Mobile pixel-height comparison is therefore invalid; the reconstruction uses a functional responsive layout instead.

## Runtime Verification

- No horizontal overflow at 1200×900 or 390×844
- No broken images
- No browser console errors or warnings
- Search highlighting and result count verified
- News summary collapse verified
- Additional news row expand/collapse verified
- Hero feed previous/next state verified
- Mobile menu open/close and ARIA state verified
