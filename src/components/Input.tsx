import React from "react";
import { TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps{
    title: string;
}

export function Input( { title, ...rest}: Props){
    return(
        <View >
            <TextInput 
                {...rest}
                placeholder={title}
                className="bg-card w-full p-4 mt-3 rounded-md"
            />
        </View>
    )
}