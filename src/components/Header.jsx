import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const options = ['Pomodoro', 'Short Break', 'Long Break'];
export default function Header({ currentTime, setCurrentTime, setIsActive, stopSound }) {

  function handlePress(index) {
    setCurrentTime(index)
    setIsActive(false)
    stopSound()
  }


  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(index)}
         style={[styles.itemStyle, index !== currentTime && {borderColor: 'transparent'} ]}>
          <Text style={{ fontWeight: 'bold' }}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  itemStyle: {
    width: '33%',
    borderWidth: 3,
    alignItems: 'center',
    borderWidth: 3,
    padding: 5,
    borderRadius: 10,
    borderColor: 'white',
    marginVertical: 20
  }
})