import { render } from '@vtex/test-tools/react'
import React from 'react'

import Shipping from '../Shipping'
import ShippingCalculator from '../ShippingCalculator'

interface InsertAddressResult {
  success: boolean
  orderForm: any
}

interface Context {
  countries: string[]
  selectedAddress: Address
  insertAddress: (address: CheckoutAddress) => Promise<InsertAddressResult>
  deliveryOptions: DeliveryOption[]
  selectDeliveryOption: (option: string) => void
}

const mockedAddress = {
  addressId: '1569522356558',
  addressType: 'residential',
  city: 'Rio de Janeiro',
  complement: '',
  country: 'BRA',
  neighborhood: 'Botafogo',
  number: '',
  postalCode: '22230-005',
  receiverName: '',
  reference: '',
  state: 'RJ',
  street: '',
  geoCoordinates: [],
}

const mockedDeliveryOptions = [
  { id: 'Motoboy', price: 500, estimate: '8d', isSelected: false },
  { id: 'PAC', price: 1000, estimate: '5d', isSelected: true },
  { id: 'Expressa', price: 1000, estimate: '7d', isSelected: false },
]

const contextInfo = {
  countries: ['BRA'],
  selectedAddress: mockedAddress,
  deliveryOptions: mockedDeliveryOptions,
  selectDeliveryOption: jest.fn(),
  insertAddress: jest.fn(),
}

describe('Shipping', () => {
  const renderComponent = (customProps: Context) => {
    const {
      countries,
      deliveryOptions,
      insertAddress,
      selectDeliveryOption,
      selectedAddress,
    } = customProps
    const wrapper = render(
      <Shipping
        countries={countries}
        deliveryOptions={deliveryOptions}
        insertAddress={insertAddress}
        loading={false}
        selectDeliveryOption={selectDeliveryOption}
        selectedAddress={selectedAddress}
        title="Title"
        canEditData
      >
        <ShippingCalculator />
      </Shipping>
    )
    return wrapper
  }

  it('should be rendered', () => {
    const component = renderComponent(contextInfo)
    expect(component).toBeDefined()
  })

  it('should show postal code', () => {
    const { getByText } = renderComponent(contextInfo)
    expect(getByText(mockedAddress.postalCode)).toBeTruthy()
  })

  it('should show delivery options', () => {
    const { getByText } = renderComponent(contextInfo)
    expect(getByText(mockedDeliveryOptions[0].id)).toBeTruthy()
  })

  it('should show delivery button', () => {
    const { getByText } = renderComponent({
      ...contextInfo,
      selectedAddress: { addressId: '', addressType: '' },
    })
    expect(getByText('View delivery options')).toBeTruthy()
  })
})
