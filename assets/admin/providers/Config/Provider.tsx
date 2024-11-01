import React from 'react'
import { AxiosError } from 'axios'

import ConfigContext, { Configuration } from '.'
import {
  doConfigureRequest,
  doShippingReqisterRequest,
  doUpdateUseDarkRequest,
  doUpdateUseTntLinksRequest,
  doUpdateUseTntAccountsRequest,
  doUpdateUseAllOrdersAreTrunkrsRequest,
  doUpdateUseBigTextRequest,
  doUpdateOrderRulesEnabled,
  doUpdateOrderRules,
  doUpdateSubRenewalsEnabled,
} from './helpers'

const initialConfigText = document.getElementById('__tr-wc-settings__')
  ?.innerText as string
const initialConfig = initialConfigText ? JSON.parse(initialConfigText) : {}

const ConfigProvider: React.FC = ({ children }) => {
  const [isWorking, setWorking] = React.useState(false)
  const [config, setConfig] = React.useState<Configuration>(initialConfig)

  const prepareConfig = React.useCallback(
    async (accessToken: string, orgId: string): Promise<void> => {
      try {
        setWorking(true)

        const pluginDetes = await doShippingReqisterRequest(
          accessToken,
          orgId,
          config.metaBag,
        )
        await doConfigureRequest(
          pluginDetes.accessToken,
          orgId,
          pluginDetes.organizationName,
          pluginDetes.integrationId,
        )

        setConfig({
          ...config,
          isConfigured: true,
          details: {
            integrationId: pluginDetes.integrationId,
            organizationId: orgId,
            organizationName: pluginDetes.organizationName,
          },
        })
      } catch (error) {
        const axiosError = error as AxiosError
        console.error(axiosError)
      } finally {
        setWorking(false)
      }
    },
    [config],
  )

  const updateIsDarkLogo = React.useCallback(async () => {
    setConfig({
      ...config,
      isDarkLogo: !config.isDarkLogo,
    })

    doUpdateUseDarkRequest(!config.isDarkLogo).catch(() => {
      setConfig({
        ...config,
        isDarkLogo: config.isDarkLogo,
      })
    })
  }, [config])

  const updateTntLinks = React.useCallback(async () => {
    setConfig({
      ...config,
      isEmailLinksEnabled: !config.isEmailLinksEnabled,
    })

    doUpdateUseTntLinksRequest(!config.isEmailLinksEnabled).catch(() => {
      setConfig({
        ...config,
        isEmailLinksEnabled: config.isEmailLinksEnabled,
      })
    })
  }, [config])

  const updateTntActions = React.useCallback(async () => {
    setConfig({
      ...config,
      isAccountTrackTraceEnabled: !config.isAccountTrackTraceEnabled,
    })

    doUpdateUseTntAccountsRequest(!config.isAccountTrackTraceEnabled).catch(
      () => {
        setConfig({
          ...config,
          isAccountTrackTraceEnabled: config.isAccountTrackTraceEnabled,
        })
      },
    )
  }, [config])

  const updateAllOrdersAreTrunkrs = React.useCallback(async () => {
    setConfig({
      ...config,
      isAllOrdersAreTrunkrsEnabled: !config.isAllOrdersAreTrunkrsEnabled,
    })

    doUpdateUseAllOrdersAreTrunkrsRequest(
      !config.isAllOrdersAreTrunkrsEnabled,
    ).catch(() => {
      setConfig({
        ...config,
        isAllOrdersAreTrunkrsEnabled: config.isAllOrdersAreTrunkrsEnabled,
      })
    })
  }, [config])

  const updateIsSubRenewalsEnabled = React.useCallback(async () => {
    setConfig({
      ...config,
      isSubRenewalsEnabled: !config.isSubRenewalsEnabled,
    })

    doUpdateSubRenewalsEnabled(!config.isSubRenewalsEnabled).catch(() => {
      setConfig({
        ...config,
        isSubRenewalsEnabled: config.isSubRenewalsEnabled,
      })
    })
  }, [config])

  const updateUseBigText = React.useCallback(async () => {
    setConfig({
      ...config,
      isBigTextEnabled: !config.isBigTextEnabled,
    })

    doUpdateUseBigTextRequest(!config.isBigTextEnabled).catch(() => {
      setConfig({
        ...config,
        isBigTextEnabled: config.isBigTextEnabled,
      })
    })
  }, [config])

  const updateUseOrderRules = React.useCallback(async () => {
    setConfig({
      ...config,
      isOrderRulesEnabled: !config.isOrderRulesEnabled,
    })

    doUpdateOrderRulesEnabled(!config.isOrderRulesEnabled).catch(() => {
      setConfig({
        ...config,
        isOrderRulesEnabled: config.isOrderRulesEnabled,
      })
    })
  }, [config])

  const updateOrderRules = React.useCallback(
    async (orderRules: string) => {
      setConfig({ ...config, orderRules })

      doUpdateOrderRules(orderRules).catch(() => {
        setConfig({ ...config, orderRules })
      })
    },
    [config],
  )

  const contextValue = React.useMemo(
    () => ({
      isWorking,
      config,
      prepareConfig,
      updateIsDarkLogo,
      updateTntLinks,
      updateTntActions,
      updateAllOrdersAreTrunkrs,
      updateUseBigText,
      updateUseOrderRules,
      updateOrderRules,
      updateIsSubRenewalsEnabled,
    }),
    [
      config,
      isWorking,
      prepareConfig,
      updateIsDarkLogo,
      updateTntActions,
      updateTntLinks,
      updateAllOrdersAreTrunkrs,
      updateUseBigText,
      updateUseOrderRules,
      updateOrderRules,
      updateIsSubRenewalsEnabled,
    ],
  )

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
