import React from "react";
import { Text, TouchableOpacity, View, TouchableOpacityProps } from "react-native";

interface Props extends TouchableOpacityProps{
    title: string;
    onPress: () => void;
    color: string;
}

export function Button( { title, color, onPress, ...rest}: Props){
    return(
        <View className="mt-4">
        <TouchableOpacity 
            className='flex-row justify-center items-center p-3 w-full rounded-md gap-3'
            style={{
              backgroundColor: color
            }}
            onPress={onPress}
        >
          <Text className='font-medium text-card text-lg'>{title}</Text>
        </TouchableOpacity>
      </View>
    )
}