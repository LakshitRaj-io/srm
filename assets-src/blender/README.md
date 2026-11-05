# Campus models

`srm_campus.blend` is the Blender 5.2 source scene with its textures packed. `build_campus.py` rebuilds it, and `prep_textures.py` makes the elevations from the references below. Web exports are in `public/models`, with half-size-texture `-sm` versions for phones. Renders used as the fallback are in `public/images/campus`.

```bash
python prep_textures.py <references> <textures>
```

```bash
blender -b -P build_campus.py -- <textures> <web output> <renders> <blend path>
```

## References

| Building | Official source | Used for |
| --- | --- | --- |
| University Building | https://www.srmist.edu.in/wp-content/uploads/2022/04/Building_UB_majestic_pic-6.jpg | Front elevation, window grid, string courses, medallion |
| University Building | https://webstor.srmist.edu.in/web_assets/srm_mainsite/files/2019/structure-and-infrastructure.pdf (page 6) | Side wall, plinth arches, cornice |
| Tech Park | Official virtual tour, "Tech Park Zone" panorama, https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm | Front elevation and all measurements |
| Tech Park | Official virtual tour, Tech Park photo album | Long side wall, plan depth, ribbon windows, entrance |
| Tech Park 2 | https://webstor.srmist.edu.in/web_assets/downloads/2026/dsbs-data-chronicle-oct-2025.pdf (cover) | Everything. See below. |

## How reliable each model is

- **University Building:** front and one side are photographed. Height follows the official 16 storeys. The depth (42 m) comes from the side's 8 window bays at the front's pitch. The rear and roof top are estimates. The plinth is rebuilt from the three-quarter photograph because palms hide it in the front photograph.
- **Tech Park:** front and one long side are photographed. The depth (42 m), rear, roof plant and courtyard are estimates. The side wall's base is hidden by trees, so its window rows repeat there.
- **Tech Park 2:** **needs confirmation.** The only reference found is an unlabelled architectural rendering on the Data Science and Business Systems newsletter cover, not a photograph. That department is based in Tech Park 2, so the match is an inference. Its height, depth, far walls and long-wall length are not known, and the image is small (456 x 642). Replace it if photographs or drawings become available.
