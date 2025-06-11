import React, {useState} from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

import { Alert, Text, TouchableOpacity, View, Modal } from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

import { FirebaseError } from "firebase/app";
import { auth } from '../firebaseConfig';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { themes } from '../styles/themes';
import { Loading } from '../components/Loading';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [emailReset, setEmailReset] = useState("");
  const [senha, setSenha] = useState("");
  const [ nome, setNome ] = useState("");
  const [ emailS, setEmailS ] = useState("");
  const [ senhaS, setSenhaS ] = useState("");
  const [alert, setAlert] = useState("");
  const [ visible, setVisible ] = useState(false);
  const [ visibleSingup, setVisibleSingup ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  function cleanInput (){
    setEmail("");
    setSenha("");
    setAlert("");
    setEmailS("");
    setNome("");
    setSenhaS("");
  }

  async function handleLogin (){
    if(!email.trim() || !senha.trim()){
      setAlert("Preeche todos os campos!");
    }else{
      setLoading(true);
      try{
        const login = await signInWithEmailAndPassword(auth, email, senha );
  
        const id = login.user.uid;

        navigation.navigate('Home', { userId: id });

        cleanInput();
      }catch( error ){
        const firebaseError = error as FirebaseError;

        if (firebaseError.code === 'auth/weak-password') {
          setAlert("Sua senha deve ter pelo menos 6 caracteres.");
        } else if (firebaseError.code === 'auth/invalid-email') {
          setAlert("Email inválido. Verifique e tente novamente.");
        } else if (firebaseError.code === 'auth/user-not-found') {
          Alert.alert(
            "Não encontrado",
            "Parece que não tens uma conta, deseja cadastrar-se?",
            [
              {
                text: "sim",
                onPress: () => setVisibleSingup(true)
              },
              {
                text: "tentar novamente",
                style: "cancel"
              }
            ]
          );
          cleanInput();
        } else if (firebaseError.code === 'auth/missing-email') {
          setAlert("O campo de email está vazio.");
        } else if (firebaseError.code === 'auth/network-request-failed') {
          setAlert("Conecta-te a internet por favor.");
        } else if (firebaseError.code === 'auth/wrong-password') {
          setAlert("Senha incorreta. Verifique e tente novamente.");
        } else if (firebaseError.code === 'auth/invalid-credential') {
          Alert.alert(
            "Não encontrado",
            "Parece que não tens uma conta, deseja cadastrar-se?",
            [
              {
                text: "sim",
                onPress: () => setVisibleSingup(true)
              },
              {
                text: "tentar novamente",
                style: "cancel"
              }
            ]
          );
          cleanInput();
        } else {
          setAlert("Erro inesperado. Tente novamente mais tarde.");
          console.error("Erro ao criar conta:", firebaseError);
        }
      }finally{
        setLoading(false);
      }
    }
  }

  async function handleSingup () {
    if(!emailS.trim() || !senhaS.trim() || !nome.trim()){
      setAlert("Preeche todos os campos!");
    }else{
      console.log("Email recebido: "+ emailS);
      setLoading(true);
      try{
        const userCredential = await createUserWithEmailAndPassword(auth, emailS, senhaS);
        const user = userCredential.user;

        const id = user.uid;
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        navigation.navigate('Home', { userId: id });

        cleanInput();
      }catch( error ){
        const firebaseError = error as FirebaseError;

        if (firebaseError.code === 'auth/weak-password') {
          setAlert("Sua senha deve ter pelo menos 6 caracteres.");
        } else if (firebaseError.code === 'auth/invalid-email') {
          setAlert("Email inválido. Verifique e tente novamente.");
        } else if (firebaseError.code === 'auth/missing-email') {
          setAlert("O campo de email está vazio.");
        }else if (firebaseError.code === 'auth/network-request-failed') {
          setAlert("Conecta-te a internet por favor.");
        }else if (firebaseError.code === 'auth/wrong-password') {
          setAlert("Senha incorreta. Verifique e tente novamente.");
        } else {
          setAlert("Erro inesperado. Tente novamente mais tarde.");
          console.error("Erro ao criar conta:", firebaseError);
        }
      }finally{
        setLoading(false);
      }
    }
  }

  async function resetPassword(){
    if(emailReset === ""){
      Alert.alert("Email não existente", "Adiciona o teu email para poder recuperar a senha");
    }else{
      try {
        await sendPasswordResetEmail(auth, emailReset);
        Alert.alert("E-mail de recuperação enviado com sucesso!");
      } catch (error) {
        const firebaseError = error as FirebaseError;
        
        if (firebaseError.code === "auth/user-not-found") {
          Alert.alert("E-mail não encontrado.");
        } else if (firebaseError.code === "auth/invalid-email") {
          Alert.alert("E-mail inválido.");
        } else {
          Alert.alert("Erro ao enviar e-mail. Tente novamente.");
        }
      }
    }
  }

  return (
    <View className='
      flex-1
      bg-background
      items-center
      justify-center
    '>
      <View className='px-10 pt-14 w-full justify-center items-center'>
        <FontAwesome6 name="unlock-keyhole" size={58} color="#2F80ED" />
        <Text className='text-base text-primary uppercase'>Gerador de Senhas</Text>
      </View>

      <View className='w-full px-8'>
        <Text className='text-error font-bold text-sm'>{alert}</Text>
        <Input 
          title='Email'
          value={email}
          keyboardType='email-address'
          onChangeText={setEmail}
        />
        <Input 
          title='Senha'
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity 
          className='pt-2 items-end'
          onPress={() => setVisible(true)}
        >
          <Text className='text-primary font-bold'>Esqueci a minha palavra-passe</Text>
        </TouchableOpacity>

        {loading ? (
          <Loading color={themes.colors.btn} />
        ) : (
          <Button
            title='Entrar'
            onPress={handleLogin}
            color={themes.colors.btn}
          />
        )}

        <Text className='text-center font-medium m-2'>Ou</Text>
        <TouchableOpacity 
          className='flex-row justify-center items-center p-3 w-full rounded-md gap-3'
          style={{
            borderWidth: 1,
            borderColor: themes.colors.btn,
            borderStyle: "dashed"
          }}
          onPress={() => {
            setVisibleSingup(true)
            cleanInput();
          }}
        >
          <Text style={{ color: themes.colors.btn }}>Cadastrar-se</Text>
        </TouchableOpacity>

      </View>

      <Modal
          transparent
          animationType="fade"
          visible={visible}
      >
          <View 
              className="justify-center px-4 flex-1"
              style={{
                  backgroundColor: 'rgba(28, 29, 46, 0.7)'
              }}
          >
            <View className='bg-background rounded-md mb-2 p-4 justify-center'>
              <Text className='text-textPrimary text-lg font-bold mb-2'>Recuperar Senha</Text>
              <Input 
                title='Email'
                value={emailReset}
                onChangeText={setEmailReset}
                keyboardType='email-address'
              />
              <Button 
                title='Enviar Email de Recuperação'
                onPress={resetPassword}
                color={themes.colors.btn}
              />
            </View>
            <TouchableOpacity 
                className="w-full justify-center items-center"
                onPress={() => setVisible(false)}
            >
                <Feather name="x-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
      </Modal>
      <Modal
          transparent
          animationType="fade"
          visible={visibleSingup}
      >
          <View 
              className="justify-end flex-1"
              style={{
                  backgroundColor: 'rgba(28, 29, 46, 0.7)'
              }}
          >
            <TouchableOpacity 
                className="w-full justify-center items-center"
                onPress={() => setVisibleSingup(false)}
            >
                <Feather name="x-circle" size={30} color="#fff" />
            </TouchableOpacity>
            <View className='bg-background rounded-s-2xl mt-4 p-6 justify-center'>
              <Text className='text-textPrimary text-lg font-bold mb-2'>Cadastra-se</Text>
              { alert === "" ? (
                  <Text
                    style={{display: 'none'}}
                  ></Text>
                ) : (
                  <Text className='text-error font-bold text-sm'>{alert}</Text>
                )
              }
              <Input
                title='Nome'
                value={nome}
                onChangeText={setNome}
              />
              <Input
                title='Email'
                value={emailS}
                onChangeText={setEmailS}
                keyboardType='email-address'
              />
              <Input 
                title='Senha'
                value={senhaS}
                secureTextEntry
                onChangeText={setSenhaS}
              />
              { loading ? (
                <Loading color={themes.colors.btn} />
              ) : (
                <Button 
                title='Cadastrar-se'
                onPress={handleSingup}
                color={themes.colors.btn}
              />
              ) }
            </View>
          </View>
      </Modal>
    </View>
  );
}