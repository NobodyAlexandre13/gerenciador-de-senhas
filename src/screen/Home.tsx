import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from '@react-navigation/native';

import { FlatList, Modal, Text, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

import * as LocalAuthentication from 'expo-local-authentication';

import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";

import Feather from '@expo/vector-icons/Feather';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Button } from "../components/Button";
import { themes } from "../styles/themes";
import { StatusBar } from "expo-status-bar";
import { CardPassword } from "../components/CardPassword";
import { Input } from "../components/Input";
import { CardAcessPassword } from "../components/CardAcessPassword";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export function Home(){
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const [senhasCarregadas, setSenhasCarregadas] = useState<any[]>([]);
    const [ visibleModal, setVisibleModal ] = useState(false);
    const [ id, setId ] = useState("");
    const [ senha, setSenha ] = useState("");
    const [ plataforma, setPlataforma ] = useState("");
    const [ usuario, setUsuario ] = useState("");
    const [ idUpdated, setIdUpdated ] = useState("");
    const [ visiblePass, setVisiblePass ] = useState(false);

    const { userId } = route.params;

    function handleNextScreen(){
        navigation.navigate('Pass', {userId});
    }

    async function handleLogout(){
        await signOut(auth);
        navigation.goBack();
    }

    async function VerifyBiometric (id: string){
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

        if(!isBiometricEnrolled){
            return Alert.alert("Acesso negado", "Nenhuma biometria encontrada. Por favor cadastre no dispositivo!")
        }

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Acesso com biometria",
            fallbackLabel: "Não reconhecido..."
        });

        if(auth.success){
            return getPasswordShow(id);
        }
    }

    useEffect(() => {
        if (!userId) return;

        const senhasRef = collection(firestore, "senhas");
        const q = query(senhasRef, where("userId", "==", userId));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const senhas: any[] = [];
          querySnapshot.forEach((doc) => {
            senhas.push({ id: doc.id, ...doc.data() });
          });
          setSenhasCarregadas(senhas);
        }, (error) => {
          console.error("Erro ao buscar senhas em tempo real:", error);
        });
    
        // Cleanup listener quando o componente desmontar
        return () => unsubscribe();
    }, [userId]);

    async function getPasswordShow(id: string){
        console.log(id);
        try{
            const docRef = doc(firestore, "senhas", id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const dados = docSnap.data();

                setId(id);
                setPlataforma(dados.plat);
                setUsuario(dados.usuario);
                setSenha(dados.senha);
                setVisiblePass(true);
            }else{
                console.log("Dados não encontrados..")
            }
        }catch(error){
            console.error("Erro ao buscar senha:", error);
            return null;
        }
    }

    async function buscarSenhaPorId(id: string) {
        try {
          const docRef = doc(firestore, "senhas", id);
          const docSnap = await getDoc(docRef);
      
          if (docSnap.exists()) {
            const dados = docSnap.data();

            
            setPlataforma(dados.plat);
            setUsuario(dados.usuario);
            setSenha(dados.senha);
            setVisibleModal(true);
          } else {
            console.log("Documento não encontrado");
            return null;
          }
        } catch (error) {
          console.error("Erro ao buscar senha:", error);
          return null;
        }
    }

    async function updatePassword(id: string) {
        try{
            const docRef = doc(firestore, 'senhas', id);

            await updateDoc(docRef, {
                plat: plataforma,
                usuario,
                senha
            });

            setVisibleModal(false);
        }catch(error){
            console.error(error);
        }
    }

    return(
        <View className=' flex-1 bg-background'>
            <StatusBar style="inverted"/>
            <View className="flex-1">
                <View className="bg-primary w-full pb-3">
                    <View className="w-full flex-row px-8 pt-16 justify-between items-center">
                        <View className='items-center flex-row gap-2'>
                            <FontAwesome6 name="unlock-keyhole" size={40} color="#fff" />
                            <View>
                                <Text className='text-lg text-card uppercase font-bold'>Cripto Key</Text>
                                <Text className='text-sm text-border -mt-1 font-regular'>Gerador de Senhas</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleLogout}>
                            <Feather name="log-out" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View className="px-8 py-2">
                        <Button title="Guardar Senha" onPress={handleNextScreen} color={themes.colors.btn}/>
                    </View>
                </View>
                <View className="flex-1 px-8">
                    <Text className="mb-4 mt-6 uppercase font-bold text-textSecondary text-sm">
                        Senhas guardadas
                    </Text>
                    <FlatList
                        data={senhasCarregadas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <CardAcessPassword date={item} onPress={() => VerifyBiometric(item.id)}/>}
                        ListEmptyComponent={
                            <Text className="text-textSecondary font-regular text-base text-center mt-4">
                                Nenhuma senha guardada.
                            </Text>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            <Modal
                transparent
                animationType="slide"
                visible={visibleModal}
            >
                <View 
                    className="justify-center px-4 flex-1"
                    style={{
                        backgroundColor: 'rgba(28, 29, 46, 0.3)'
                    }}
                >
                    <View className="bg-background w-full rounded px-8 py-8">
                        <Text className="text-2xl text-textSecondary font-medium">Atualizar dados</Text>
                        <View>
                            <Input 
                                title="Plataforma"
                                value={plataforma}
                                onChangeText={setPlataforma}
                            />
                            <Input 
                                title="Usuário"
                                value={usuario}
                                onChangeText={setUsuario}
                            />
                            <Input 
                                title="Senha"
                                value={senha}
                                onChangeText={setSenha}
                            />
                        </View>
                        <View className="flex-row justify-between">
                            <View className="w-1/2">
                                <Button 
                                    title="Salvar"
                                    onPress={() => updatePassword(idUpdated)}
                                    color= {themes.colors.btn}
                                />
                            </View>
                            <View className="w-2/5">
                                <Button 
                                    title="Cancelar"
                                    onPress={() => setVisibleModal(false)}
                                    color= {themes.colors.error}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent
                animationType="fade"
                visible={visiblePass}
            >
                <View 
                    className="justify-center px-4 flex-1"
                    style={{
                        backgroundColor: 'rgba(28, 29, 46, 0.7)'
                    }}
                >
                    <CardPassword 
                        onPress={() => {
                            setIdUpdated(id)
                            buscarSenhaPorId(id)
                        }}
                        senha={senha}
                        plat={plataforma}
                        usuario={usuario}
                        id={id}
                    />

                    <TouchableOpacity 
                        className="w-full justify-center items-center"
                        onPress={() => setVisiblePass(false)}
                    >
                        <Feather name="x-circle" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}