import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'


type RoundBtnProps={
    text:string
    icon:typeof Ionicons.defaultProps
    onPress?:()=>void

    

}

const RoundBtn = ({icon,text,onPress}:RoundBtnProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={30} color={Colors.dark}/>
      </View>
      <Text>{text}</Text>
    </TouchableOpacity>
  )
}


const styles=StyleSheet.create({
    container:{
        alignItems:"center",
        gap:10,
    },
    text:{
        color:Colors.dark,
        fontSize:16,
        fontWeight:"500"
    },
    circle:{
        width:60,
        height:60,
        borderRadius:50,
        backgroundColor:Colors.lightGray,
        alignItems:"center",
        justifyContent:"center"
    }
})

export default RoundBtn