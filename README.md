# Lonewolf Nightvision VR

Visor digital de baja luminosidad para teléfono y VR Box.

## Versión actual
- Retícula VR duplicada correctamente para ambos ojos.
- HUD y brújula duplicados por ojo en VR.
- Zoom inicial conservado en **0.9×**.
- Brújula basada en orientación absoluta del dispositivo cuando está disponible, con `webkitCompassHeading` para iPhone.
- Modo **NORMAL** en color real de la cámara.
- Medición tangencial con referencia **45 × 45 cm** a **20 m**.
- Altura de cámara **1,65 m** y rango operativo **5–100 m**.
- Punto de medición fijado en el **centro de la retícula**.
- Inicio de medición mediante sacudida de cabeza **izquierda → derecha**.
- Confirmación mediante círculo central que se completa en verde al mantener la cabeza estable.
- Cierre de medición mediante sacudida de cabeza **abajo → arriba**.
- Distancia mostrada **a la derecha de la retícula**.
- Service Worker versionado para actualizar correctamente la Web App de iPhone.

## Uso de medición
1. Activá **MEDICIÓN ON**.
2. Apuntá el centro de la retícula a la **base del objeto**.
3. Hacé una sacudida clara de cabeza de **izquierda a derecha**.
4. Mantené la cabeza quieta. El círculo alrededor de la retícula se completa en verde.
5. Al completarse, la aplicación fija la distancia y la muestra a la derecha de la retícula.
6. Para cerrar la medición, hacé una sacudida de **abajo hacia arriba**.

La distancia central se calcula mediante el ángulo físico de inclinación del teléfono respecto de la gravedad, usando la altura de cámara de 1,65 m. La referencia de 45 × 45 cm se conserva como referencia visual a 20 m. La precisión depende de la estabilidad del teléfono, la alineación con la base del objeto y las características del VR Box.

## Sensores en iPhone
La aplicación solicita los permisos de orientación y movimiento durante el botón inicial de arranque. iOS/Safari requiere una activación del usuario para solicitar acceso a estos sensores cuando `requestPermission()` está disponible.
