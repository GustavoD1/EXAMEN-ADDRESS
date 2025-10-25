import { get, post, patch, destroy } from './helpers/ApiRequestsHelper'

function getAddresses () {
  return get('/shippingaddresses')
}

function addAddress (data) {
  return post(data)
}

function setDefault (id) {
  return patch(id)
}

function deleteAddress (id) {
  return destroy(id)
}

export { getAddresses, addAddress, setDefault, deleteAddress }
