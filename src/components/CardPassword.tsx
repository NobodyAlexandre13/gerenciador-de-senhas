import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { firestore } from "../firebaseConfig";

import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { deleteDoc, doc } from 'firebase/firestore';

interface Props{
    date: {
        id: string;
        plat: string;
        usuario: string;
        senha: string;
    },
    onPress: () => void;
}

export function CardPassword( { date, onPress }: Props){

    function copyPass() {
        Clipboard.setStringAsync(date.senha);
        Alert.alert("Copiado", "Senha copiada para a área de transferência.");
    }
      
    async function RemovePassword(id: string){
        try{
            const docRef = doc(firestore, 'senhas', id);
            await deleteDoc(docRef);
            Alert.alert("Removido com sucesso!!");
        }catch(error){
            console.error("Erro ao excluir a senha: ", error);
        }
    }

    function handleDeletePass(id: string){
        Alert.alert(
            "Confirmar ação", 
            "Tens certeza que desejas excluir esta senha?",
            [
                {
                    text: 'Sim',
                    onPress: () => RemovePassword(id)
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        )
    }

    return(
        <View className="w-full bg-card p-4 rounded mb-2">
            <View>
                <Text className="font-medium text-textSecondary text-base">{date.plat}</Text>
                <View className="flex-row justify-between mt-2">
                    <Text numberOfLines={1} className="font-bold text-xl text-textPrimary ">{date.senha}</Text>
                    <TouchableOpacity
                        onPress={copyPass}
                    >
                        <Feather name="copy" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <Text className="font-medium text-sm text-textSecondary">{date.usuario}</Text>

                <View className="flex-row justify-between w-full mt-4">
                    <TouchableOpacity 
                        className="flex-row gap-2 bg-btnEdit rounded p-2 justify-center items-center"
                        style={{
                            width: '48%'
                        }}
                        onPress={onPress}
                    >
                        <MaterialIcons name="edit" size={24} color="white" />
                        <Text className="text-card font-regular">Editar</Text>
                    </TouchableOpacity >
                    <TouchableOpacity 
                        className="flex-row gap-2 bg-error rounded p-2 justify-center items-center"
                        style={{
                            width: '48%'
                        }}
                        onPress={() => handleDeletePass(date.id)}
                    >
                        <MaterialIcons name="delete" size={24} color="white" />
                        <Text className="text-card font-regular">Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}