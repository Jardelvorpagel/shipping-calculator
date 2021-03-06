import React, { FunctionComponent, Fragment } from 'react'
import { Radio } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import ShippingInfo from './ShippingInfo'
import DeliveryOptionsAvailability from './DeliveryOptionsAvailability'
import { slugify } from '../utils/slugify'

interface CustomProps {
  numberOfItems: number
  numberOfUnavailableItems: number
  options: DeliveryOption[]
  selectDeliveryOption: (option: string) => void
}

const ShippingOptions: FunctionComponent<CustomProps> = ({
  numberOfItems,
  numberOfUnavailableItems,
  options,
  selectDeliveryOption,
}) => {
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    selectDeliveryOption(event.currentTarget.value)
  }

  const allItemsUnavailable = numberOfUnavailableItems === numberOfItems

  return (
    <Fragment>
      <DeliveryOptionsAvailability
        numberOfItems={numberOfItems}
        numberOfUnavailableItems={numberOfUnavailableItems}
      />
      {numberOfUnavailableItems > 0 && !allItemsUnavailable && (
        <div className="fw5 mt6 mb6">
          <FormattedMessage
            id="store/shipping-calculator.optionsForRemainingProducts"
            values={{
              numberOfOptions: options.length,
              numberOfItems: numberOfItems - numberOfUnavailableItems,
            }}
          />
        </div>
      )}

      {options &&
        options.length > 0 &&
        options.map((option, i) => {
          const optionId = slugify(`shipping-option-${option.id}`)
          // eslint-disable-next-line
          const isLast = i + 1 >= options.length

          return (
            <div key={optionId} className={isLast ? '' : 'mb5'}>
              <Radio
                key={optionId}
                name={optionId}
                id={optionId}
                isLast={isLast}
                checked={option.isSelected}
                onChange={handleChange}
                value={option.id}
                label={<ShippingInfo option={option} />}
              />
            </div>
          )
        })}
    </Fragment>
  )
}

ShippingOptions.defaultProps = {
  options: [],
}

export default ShippingOptions
