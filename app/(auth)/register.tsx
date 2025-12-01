import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleRegister = () => {

        console.log('Register button pressed', { username, password });
        if (password.length >=4 && username.length >= 6 ) {
            console.log('Register successful', username,' ', password);
            setErrorMessage('Successfully registered!');
        } else {
            console.log('Register failed');
            setErrorMessage('Registration failed. Please check your credentials.');
        }
    };


  return (
    <SafeAreaView>  
        <StatusBar style="auto"/>
        <ScrollView>
            <View>
                
                {/* Title */}
                <Text>Register</Text>
                
                {/* Username Input */}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                
                {/* Password Input */}
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity  onPress={ handleRegister }>
                    <Text>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>Already have an account?</Text>
                <Button title="Login" onPress={() => { console.log("Navigate to Login") }}/>
            </View>
            <View>
                <Text>{(errorMessage)}</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
    );
}