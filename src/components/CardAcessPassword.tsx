import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';

interface Props{
    date: {
        id: string;
        plat: string;
        usuario: string;
    },
    onPress: () => void;
}

export function CardAcessPassword( { date, onPress }: Props){
    return(
        <TouchableOpacity 
            className="w-full bg-card p-4 rounded mb-2"
            onPress={onPress}
        >
            <View>
                <Text className="font-medium text-textSecondary text-base">{date.plat}</Text>
                <View className="flex-row justify-between mt-2">
                    <Text numberOfLines={1} className="font-bold text-xl text-textPrimary ">*************...</Text>
                    <Feather name="eye" size={24} color="black" />
                </View>

                <Text className="font-medium text-sm text-textSecondary">{date.usuario}</Text>
            </View>
        </TouchableOpacity>
    )
}