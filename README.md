# Lonewolf Nightvision VR

Visor digital de baja luminosidad para teléfono y VR Box, diseñado para uso **exclusivo en orientación paisaje/horizontal**.

## Versión actual
- Cámara trasera y uso bloqueado en vertical.
- Sensores de movimiento/orientación interpretados para la posición **paisaje**.
- Retícula VR duplicada correctamente para ambos ojos.
- HUD y brújula duplicados por ojo en VR.
- Zoom inicial conservado en **0.9×**.
- Brújula basada en orientación absoluta del dispositivo cuando está disponible, con corrección de orientación de pantalla.
- Modo **NORMAL** en color real de la cámara.
- Medición tangencial con referencia **45 × 45 cm** a **20 m**.
- Altura de cámara **1,65 m**.
- Rango operativo ampliado a **5–150 m**. Fuera de esos límites muestra **FUERA DE RANGO**.
- Punto de medición fijado en el **centro de la retícula**.
- Inicio de medición mediante sacudida de cabeza **izquierda → derecha**.
- Confirmación mediante círculo central que se completa en verde al mantener la cabeza estable.
- Cierre de medición mediante sacudida **abajo → arriba**.
- Distancia mostrada **a la derecha de la retícula**.
- Contraste del HUD adaptado automáticamente al modo **VERDE NV, BLANCO/NEGRO, TÉRMICO o NORMAL**.
- Service Worker versionado para actualizar correctamente la Web App.

## Uso de medición
1. Colocá el teléfono en **paisaje**.
2. Activá **MEDICIÓN ON**.
3. Apuntá el centro de la retícula a la **base del objeto**.
4. Hacé una sacudida clara de cabeza de **izquierda a derecha**.
5. Mantené la cabeza quieta. El círculo alrededor de la retícula se completa en verde.
6. Al completarse, la aplicación fija la distancia y la muestra a la derecha de la retícula.
7. Para cerrar la medición, hacé una sacudida de **abajo hacia arriba**.

La distancia se calcula mediante el ángulo físico de elevación de la óptica respecto de la gravedad, usando la altura de cámara de 1,65 m. La referencia de 45 × 45 cm se conserva como referencia visual a 20 m. La precisión en distancias muy largas depende de la estabilidad de los sensores; alrededor de 150 m el ángulo es muy pequeño, por lo que conviene mantener el teléfono completamente estable.

## Sensores en iPhone
La aplicación solicita los permisos de movimiento y orientación durante el botón inicial. En paisaje, el gesto horizontal se detecta mediante cambios de rumbo y el gesto vertical mediante cambios de elevación obtenidos de la gravedad, evitando depender directamente de beta/gamma, cuyos ejes cambian al girar el teléfono.
