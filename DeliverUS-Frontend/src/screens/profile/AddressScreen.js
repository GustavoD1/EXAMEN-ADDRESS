import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import TextError from '../../components/TextError'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'

export default function AddressScreen ({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState(null)
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)

  useEffect(() => {
    fetchAddresses()
  }, [route])

  async function fetchAddresses () {
    try {
      const fetchedAddresses = await getAddresses()

      setAddresses(fetchedAddresses)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving addresses. ${error} `,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
        <View>
          <TextSemiBold textStyle={styles.textTitle}>{'Mis direcciones'}</TextSemiBold>
        </View>
    )
  }

  const handleSetDefault = async (values) => {
    try {
      await setDefault(values.id)
      fetchAddresses()
      showMessage({
        message: 'Dirección predeterminada actualizada correctamente.',
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) {
      showMessage({
        message: `Error al establecer la dirección como predeterminada: ${error}`,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }

  const renderAddresses = ({ item }) => {
    return (
        <View style ={{ flexDirection: 'row', padding: 20, justifyContent: 'space-between', marginLeft: 20, marginRight: 20 }}>
      <View >
        <TextSemiBold>{item.alias}</TextSemiBold>
      </View>
      <View >
        <TextRegular>{item.street}, {item.city}, {item.province}, {item.zipCode}</TextRegular>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Pressable
            onPress={() => handleSetDefault(item)}
            style={({ pressed }) => [
              {
                backgroundColor: 'transparent'
              },
              styles.actionButton
            ]}>
              <Ionicons name= {item.isDefault ? 'star' : 'star-outline'} size={24} color={'#FFC107'} />
          </Pressable>
          <Pressable
            onPress={(() => setAddressToBeDeleted(item))}
            style={({ pressed }) => [
              {
                backgroundColor: 'transparent'
              },
              styles.actionButton
            ]}>
              <Ionicons name= 'trash-outline' size={24} color={'red'} />
          </Pressable>
      </View>
      </View>

    )
  }

  const renderSeparator = () => {
    return <View style={styles.separator} />
  }

  const removeAddress = async (value) => {
    try {
      await deleteAddress(value.id)
      setAddressToBeDeleted(null)
      fetchAddresses()
      showMessage({
        message: `Address ${value.alias} succesfully removed`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address ${value.alias} could not be removed.`,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }

  return (
    <>
    <View style={styles.container}>
          <FlatList
              ItemSeparatorComponent={renderSeparator}
              ListHeaderComponent={renderHeader}
              style={styles.container}
              data={addresses}
              renderItem={renderAddresses}
              keyExtractor={item => item.id.toString()}
            />
            <Pressable
            onPress={() => navigation.navigate('AddressDetailScreen')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? brandPrimaryTap
                  : brandPrimary
              },
              styles.button
            ]}>
            {<TextRegular textStyle={styles.textButtom}>
              Añadir nueva dirección
            </TextRegular> }
          </Pressable>
          <DeleteModal
            isVisible={addressToBeDeleted !== null}
            onCancel={() => setAddressToBeDeleted(null)}
            onConfirm={() => removeAddress(addressToBeDeleted)}>
              <TextRegular>¿Seguro que quieres eliminar esta dirección?</TextRegular>
            </DeleteModal>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 20,
    color: 'black',
    padding: 15
  },
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 15
  },
  button: {
    textAlign: 'center',
    borderRadius: 8,
    marginBottom: 5,
    height: 40,
    width: '95%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textButtom: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  actionButton: {
    padding: 8,
    marginLeft: 10
  }

})
