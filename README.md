# Lonewolf Nightvision VR

Visor digital de baja luminosidad para teléfono y VR Box.

## Versión actual
- Retícula VR corregida para ambos ojos.
- HUD y brújula duplicados por ojo en VR.
- Zoom inicial conservado en **0.9×**.
- Brújula basada en orientación absoluta del dispositivo cuando está disponible, con `webkitCompassHeading` para iPhone.
- Brújula más grande, legible y separada del borde superior.
- Medición tangencial con referencia **45 × 45 cm** a **20 m**.
- Escala reglada vertical de **20 a 100 m**, calculada según la relación tangencial de la referencia.
- Puntero VR controlado mediante sensores de orientación.
- Selección **Dwell de 1 segundo** para usar el visor sin tocar la pantalla dentro del VR Box.
- La selección fija la base del objeto y muestra la distancia aproximada.
- Service Worker versionado para actualizar correctamente la Web App de iPhone.

## Uso de medición en VR
1. Activá **VR BOX**.
2. Colocá la parte superior del objeto de 45 × 45 cm sobre la línea central de la retícula.
3. Mové suavemente la cabeza/teléfono hasta que el puntero quede sobre la base del objeto y coincida con la marca de la escala.
4. Mantené la cabeza quieta durante aproximadamente **1 segundo**.
5. El puntero se completa y la aplicación fija la medición.

La escala es una referencia trigonométrica para estimación visual. La precisión real depende del FOV de la cámara, alineación del objeto, estabilidad del teléfono y características ópticas del VR Box.

## Sensores en iPhone
La aplicación solicita el permiso de orientación durante el botón inicial de arranque, ya que iOS exige una activación del usuario para solicitar acceso a los sensores de orientación. En HTTPS/Safari moderno, `DeviceOrientationEvent.requestPermission(true)` puede solicitar también los datos necesarios para orientación absoluta. citeturn1search0
