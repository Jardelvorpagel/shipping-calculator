import React, { useState, FunctionComponent } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { components, helpers } from 'vtex.address-form'

import PostalCode from './PostalCode'
import ShippingResult from './ShippingResult'
import { newAddress } from '../utils/address'

const { AddressContainer, AddressRules, StyleguideInput } = components
const { addValidation, removeValidation } = helpers
interface InsertAddressResult {
  success: boolean
  orderForm: any
}

interface CustomProps {
  canEditData: boolean
  insertAddress: (address: CheckoutAddress) => Promise<InsertAddressResult>
  selectedAddress: Address
  deliveryOptions: DeliveryOption[]
  countries: string[]
  selectDeliveryOption: (option: string) => void
  numberOfItems: number
  numberOfUnavailableItems: number
}

const EstimateShipping: FunctionComponent<CustomProps> = ({
  canEditData,
  insertAddress,
  selectedAddress,
  deliveryOptions,
  countries,
  selectDeliveryOption,
  numberOfItems,
  numberOfUnavailableItems,
}) => {
  const { account, culture } = useRuntime()

  const [address, setAddress] = useState<AddressWithValidation>(
    addValidation(
      selectedAddress
        ? newAddress(selectedAddress)
        : newAddress({ country: culture.country })
    )
  )

  const [loading, setLoading] = useState<boolean>(false)

  const [showResult, setShowResult] = useState<boolean>(
    selectedAddress && !!selectedAddress.postalCode
  )

  const handleAddressChange = (updatedAddress: AddressWithValidation) => {
    setAddress(updatedAddress)
  }

  const handleSubmit = () => {
    const addressWithoutValidation = removeValidation(address)
    const postalCodeValid = address?.postalCode?.valid

    if (!postalCodeValid) {
      return
    }

    insertAddress(addressWithoutValidation).then(
      (result: InsertAddressResult) => {
        if (result.success) {
          setShowResult(true)
        }
        setLoading(false)
      }
    )
    setLoading(true)
  }

  return (
    <AddressRules
      country={address.country && address.country.value}
      shouldUseIOFetching
    >
      <AddressContainer
        accountName={account}
        address={address}
        Input={StyleguideInput}
        onChangeAddress={handleAddressChange}
        shouldHandleAddressChangeOnMount
      >
        {showResult ? (
          <ShippingResult
            canEditData={canEditData}
            address={address}
            options={deliveryOptions}
            setShowResult={setShowResult}
            selectDeliveryOption={selectDeliveryOption}
            numberOfItems={numberOfItems}
            numberOfUnavailableItems={numberOfUnavailableItems}
          />
        ) : (
          <PostalCode
            loading={loading}
            handleSubmit={handleSubmit}
            countries={countries}
          />
        )}
      </AddressContainer>
    </AddressRules>
  )
}

EstimateShipping.defaultProps = {
  countries: [],
  deliveryOptions: [],
}

export default EstimateShipping
