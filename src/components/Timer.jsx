import { View, Text, StyleSheet, Animated } from 'react-native'
import { useRef, useEffect } from 'react'
// Animated permite crear animaciones en React Native
export default function Timer({ time }) {

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (time === 0) {
      // Define la animación de parpadeo solo si time es 0
      const blinkingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        {
          iterations: 4, // Ajusta a 4 para lograr un total de 4 segundos de parpadeo
        }
      );

      // Inicia la animación
      blinkingAnimation.start();
    }

    return () => {
      // Detiene la animación al desmontar o si time cambia y no es 0
      opacity.setValue(1); // Restablece la opacidad a 1 cuando el componente se desmonta o el tiempo cambia
    };
  }, [time, opacity]); // Agrega opacity a las dependencias si planeas cambiar su valor inicial en algún momento

  const formattedTime = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacity}}>
        <Text style={styles.time}>{formattedTime}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 15,
  },
  time: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333'
  }
}); 