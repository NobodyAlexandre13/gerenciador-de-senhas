import React from "react";
import { View, ActivityIndicator } from "react-native";

interface Props {
    color: string
}
export function Loading({color}: Props){
    return(
        <View className="mt-3">
            <ActivityIndicator size="large" color={color}/>
        </View>
    )
}