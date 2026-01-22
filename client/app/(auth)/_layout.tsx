import { Slot, Redirect } from 'expo-router'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { AuthContext } from '@/context/AuthContext'

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0188ef" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container} >
      <Slot />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})