import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import { BlurView } from 'expo-blur'; // Para el desenfoque de fondo
import { Audio } from 'expo-av' // Para reproducir sonidos
import Header from './src/components/Header'
import Timer from './src/components/Timer'
// colores suaves amarillo, naranja, y verde
const colors = [
  '#FFD700',
  '#ff8c00',
  '#008000'
]
export default function App() {

  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  // Definir la referencia del sonido fuera de la función
  let soundRef = useRef();

  const resetTime = () => {
    setIsCounting(false)
    switch (currentTime) {
      case 0:
        setTime(25 * 60);
        break;
      case 1:
        setTime(1 * 15);
        break;
      case 2:
        setTime(15 * 60);
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    setIsActive(false)
    resetTime()
    
  }, [currentTime])
  useEffect(() => {

    let intervalId;
    if (isPaused) {
      stopSound()
      return
    }

    if (isActive && time > 0) {
      if (time <= 13) {
        
        if(!isCounting) {
          playSoundTicTac()
          setIsCounting(true)
        }
        if (time === 0) {
          playSoundBell()
        }
      }
      intervalId = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      stopSound()
   
      playSoundBell()
      setIsCounting(false)
      setTimeout(() => {
        setIsActive(false)
        resetTime()
      }, 4000);
    } else if ( !isActive && time === 0) {
      playSoundBell()
      resetTime()

    }
    return () => clearInterval(intervalId);

  }, [isActive, time, isPaused]);

  function handleStartStop() {
    if (isActive) {
      setIsActive(false);
      setIsPaused(true);

      return;
    }
    setIsCounting(false)
    setIsPaused(false);
    playSound()
    setIsActive(!isActive);
  }
  async function playSoundBell() {
    if (!isActive) return;
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/bell.mp3')
    )
    await sound.playAsync();
  }
  const playSoundTicTac = async () => {
    if (!isActive) return;
    // Detener el sonido si ya se está reproduciendo
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      soundRef.current.unloadAsync(); // Opcional, descarga el recurso para liberar memoria
    }
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/reloj-tic-tac.mp3'),
      { shouldPlay: true }
    );
    soundRef.current = sound;
  };
   // Función para detener el sonido explícitamente si es necesario
   const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
  };
  async function playSound() {

    const { sound } = await Audio.Sound.createAsync(
      require('./assets/click.mp3')

    )
    await sound.playAsync();
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View style={[ {flex: 1, paddingHorizontal: 15, paddingTop: Platform.OS === 'android' && 30} ]}>
        
        <BlurView intensity={90} >
          <Text style={styles.title}>Pomodoro</Text>
        </BlurView>
        <Header currentTime={currentTime} setCurrentTime={setCurrentTime} setIsActive={setIsActive} stopSound={stopSound}/>
        <Timer time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{ color: 'white', fontWeight: 'bold' }} >{ isActive ? 'STOP' : isPaused ? 'CONTINUE' : 'START' }</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
     fontSize: 32,
     color: '#333333',
     fontWeight: 'bold',
     textAlign: 'center',

     },
  button: {
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
  }

});
