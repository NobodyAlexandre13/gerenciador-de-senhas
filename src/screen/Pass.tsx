import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from '../types/navigation';

import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../components/Input";

import Slider from "@react-native-community/slider";

import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig'; 


import Feather from '@expo/vector-icons/Feather';
import { Button } from "../components/Button";
import { themes } from "../styles/themes";
import { Loading } from "../components/Loading";

type PassScreenRoutesProps = RouteProp<RootStackParamList, 'Pass'>

export function Pass(){
    const navigation = useNavigation();
    const route = useRoute<PassScreenRoutesProps>();

    const [ senhaGerada, setSenhaGerada ] = useState("");
    const [ plataforma, setPlataforma ] = useState("");
    const [ user, setUser ] = useState("");
    const [ sizePass, setSizePass ] = useState(8);
    const [ isCheckedE, setIsCheckedE ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const { userId } = route.params;

    function back(){
        navigation.goBack();
    }

    function handlePass(){
        function gerarSenhaSimples(tamanho: number) {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+@#$%&*!';
            let senha = '';
          
            for (let i = 0; i < tamanho; i++) {
              const index = Math.floor(Math.random() * caracteres.length);
              senha += caracteres[index];
            }
            return senha;
        }
        const senha = gerarSenhaSimples(sizePass);
        setSenhaGerada(senha);
    }

    function setEditable(){
        setIsCheckedE(value => !value);
        setSenhaGerada("");
    }

    async function handleSavePassWord() {
        if (senhaGerada === "" || plataforma === "" || user === "") {
          Alert.alert("Preencha todos os campos");
          return;
        }
      
        setLoading(true);
      
        try {
          await addDoc(collection(firestore, "senhas"), {
            userId,
            plat: plataforma,
            usuario: user,
            senha: senhaGerada,
            criadoEm: new Date(),
          });
      
          navigation.goBack();
          console.log("Senha salva com sucesso!");
        } catch (error) {
          console.error("Erro ao adicionar senha: ", error);
          Alert.alert("Erro ao salvar senha");
        } finally {
          setLoading(false); 
        }
      }
      

    return(
        <View className="flex-1">
            <View className="bg-primary h-32 gap-10 items-center flex-row px-8">
                <View className="mt-4">
                    <TouchableOpacity 
                        onPress={back}
                    >
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View className="mt-14">
                    <Text className="text-card font-medium text-lg uppercase mb-5">
                        Gerar e guardar senha
                    </Text>
                </View>
                
            </View>
            <View className="px-8 mt-3">
                <Input
                    title="Plataforma"
                    value={plataforma}
                    onChangeText={setPlataforma}
                />
                <Input 
                    title="Usuário ou email"
                    value={user}
                    onChangeText={setUser}
                />
                <View className="mt-3">
                    <Text className="text-textSecondary font-medium ">
                        Tamanho da senha {sizePass}
                    </Text>
                    <Slider 
                        style={{width: '100%', height: 40}}
                        minimumValue={8}
                        maximumValue={70}
                        value={sizePass}
                        minimumTrackTintColor="#00388d"
                        maximumTrackTintColor="#2F80ED"
                        thumbTintColor="#00388d"
                        step={1}
                        onValueChange={setSizePass}
                    />
                </View>
                <View className="flex-row items-center gap-2">
                    <Text className="text-textSecondary font-medium ">Guardar senha existente</Text>
                    <Switch
                        value={isCheckedE}
                        onValueChange={setEditable}
                        trackColor={{ false: '#79b3ff', true: '#2F80ED' }}
                        thumbColor={isCheckedE ? '#00388d' : '#0066ff'}
                        ios_backgroundColor="#0066ff"
                    />
                </View>
                <View className="flex-row items-center justify-between gap-1">
                    <View className="w-3/4">
                        <Input 
                            title="Senha gerada aqui"
                            value={senhaGerada}
                            editable={isCheckedE}
                            onChangeText={setSenhaGerada}
                        />
                    </View>
                    <View className="w-1/5">
                        <TouchableOpacity 
                            className="w-full justify-center items-center"
                            onPress={handlePass}
                            disabled={isCheckedE}
                        >
                            <Feather name="refresh-ccw" size={28} color="#2F80ED" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {loading ? (
                        <Loading color={themes.colors.btn} />
                    ) : (
                        <Button
                            title="Guardar a senha"
                            color={themes.colors.btn}
                            onPress={handleSavePassWord}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}