import React from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch } from 'react-native' // NOTESE EL USO DE SWITCH
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'

export default function AddressDetailScreen ({ navigation, route }) {
  const initialAddressValues = { alias: null, street: null, city: null, zipCode: null, province: null, isDefault: false }
  const validationSchema = yup.object().shape({
    alias: yup
      .string()
      .max(255, 'Alias too long')
      .required('Alias is required'),
    street: yup
      .string()
      .max(255, 'Street too long')
      .required('Street is required'),
    city: yup
      .string()
      .max(255, 'City too long')
      .required('City is required'),
    zipCode: yup
      .number()
      .positive('Please provide a positive zip code value')
      .required('Price is required'),
    province: yup
      .string()
      .max(255, 'Province too long')
      .required('Province is required'),
    isDefault: yup
      .boolean()
  })

  const createAddress = async (values) => {
    try {
      const createdAddress = await addAddress(values)
      showMessage({
        message: `Address ${createdAddress.alias} succesfully created`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
      navigation.navigate('AddressScreen', { dirty: true })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Formik
      initialValues={initialAddressValues}
      validationSchema={validationSchema}
      onSubmit={createAddress}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '95%' }}>
              <TextSemibold textStyle={styles.title}>Nueva dirección</TextSemibold>
              <InputItem
                name='alias'
                label='Alias:'
                placeholder='Casa, Trabajo...'
              />
              <InputItem
                name='street'
                label='Calle:'
                placeholder='Ej: Mejos 1'
              />
              <InputItem
                name='city'
                label='Ciudad:'
                placeholder='Ej: Dos Hermanas'
              />
              <InputItem
                name='province'
                label='Provincia:'
                placeholder='Ej: Sevilla'
              />
              <InputItem
                name='zipCode'
                label='Código postal:'
                placeholder='41700'
              />
              <View style={styles.toggleContainer}>
              <TextSemibold>Dirección predeterminada</TextSemibold>
              <Switch
                thumbColor={brandSuccessDisabled}
                value={values.isDefault}
                style={styles.switch}
                onValueChange={value =>
                  setFieldValue('isDefault', value)
                }
              />
              </View>
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: brandSuccessDisabled
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                  <TextSemibold textStyle={styles.buttonText}>
                    Guardar dirección
                  </TextSemibold>
                </View>
              </Pressable>
            </View>
          </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  keyboardView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    marginTop: 15
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  toggleLabel: {
    fontSize: 16
  },
  switch: {
    marginTop: 5
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  }
})
