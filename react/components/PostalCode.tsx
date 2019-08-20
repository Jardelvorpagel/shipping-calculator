import React, { FunctionComponent, Fragment } from 'react'
import { components } from 'vtex.address-form'
import { modules } from 'vtex.country-codes'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
// @ts-ignore
const { toAlpha2 } = modules
const { CountrySelector, PostalCodeGetter, StyleguideButton } = components

defineMessages({
  delivery: {
    defaultMessage: 'estimate',
    id: 'store/shipping-calculator.estimate',
  },
})

interface CustomProps {
  countries: string[]
  handleSubmit: any
}

type Props = CustomProps & InjectedIntlProps

const PostalCode: FunctionComponent<Props> = ({
  intl,
  countries,
  handleSubmit,
}) => {
  const addCountryLabel = (countries: string[]) => {
    return countries.map((countryCode: string) => ({
      label: intl.formatMessage({ id: 'country.' + countryCode }),
      value: countryCode,
    }))
  }

  const getSubmitMessage = () =>
    intl.formatMessage({
      id: 'store/shipping-calculator.estimate',
    })

  const translatedCountries = addCountryLabel(countries)

  return (
    <Fragment>
      {translatedCountries.length > 1 && (
        <CountrySelector shipsTo={translatedCountries} />
      )}
      <PostalCodeGetter
        Button={StyleguideButton}
        submitLabel={getSubmitMessage()}
        onSubmit={handleSubmit}
      />
    </Fragment>
  )
}

export default injectIntl(PostalCode)