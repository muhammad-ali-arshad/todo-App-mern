
import React from 'react';

import { StyleSheet, TextInput, View } from 'react-native';

const InputField = ({placeholder , value, onChangeText, secureTextEntry = false}) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    inputContainer: {
        margin: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});
export default InputField;