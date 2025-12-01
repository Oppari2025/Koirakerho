import { Box, Button, ButtonText, Input, InputField, Text } from '@gluestack-ui/themed';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleLogin = () => {

        console.log('Login button pressed', { username, password });
        if (username === 'admin' && password === 'admin') {
            console.log('Login successful');
            setErrorMessage('Login successful!');
        } else {
            console.log('Login failed');
            setErrorMessage('Invalid username or password.');
        }
    };


  return (
    <SafeAreaView>  
        <StatusBar style="auto"/>
        <ScrollView>

            <Box flex={1} justifyContent="center" px="$4" backgroundColor="$backgroundLight" >

                {/* Title */}
                <Text fontWeight="$bold" >
                    Login
                </Text>

                {/* Username Input */}
                <Input >
                    <InputField
                        placeholder="Username"
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                    />
                </Input>

                {/* Password Input */}
                <Input >
                    <InputField
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </Input>

                {/* Login Button */}
                <Button  onPress={ handleLogin }>
                    <ButtonText>
                        Login
                    </ButtonText>
                </Button>

                {/* Error Message */}
                {errorMessage ? (
                    <Text  color="$red600" fontWeight="$medium">
                    {errorMessage}
                    </Text>
                ) : null}

                {/* Sign Up */}
                <Text >No account?</Text>
                <Button 
                    onPress={() => { console.log("Navigate to Sign Up") }}
                >
                    <ButtonText>Sign Up</ButtonText> 
                </Button>

                {/* Reset Password */}
                <Text >Forgot your password?</Text>
                <Button 
                    onPress={() => { console.log("Navigate to Reset Password") }}
                >
                    <ButtonText>Reset Password</ButtonText>
                </Button>

            </Box>
        </ScrollView>
    </SafeAreaView>
    );
}