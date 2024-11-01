/* eslint-disable react/no-array-index-key */
import React from 'react'
import { FormikProps, withFormik, FieldArray } from 'formik'

import Save from '../../vectors/Save'
import AddFilter from '../../vectors/AddFilter'

import Modal from '../../Modal'
import Button from '../../Button'

import './RulesModal.scss'
import Rule from './Rule'
import EmptyView from './EmptyView'
import RulesSchema from './schema'
import CircularProgress from '../../CircularProgress'

export interface RuleModel {
  field: string
  comparator: string
  value: string
}

interface RulesModalProps {
  isLoading: boolean
  open: boolean
  rules?: RuleModel[]
  onSaveRules: (rules: RuleModel[]) => void | Promise<void>
  onClose: () => void
}

interface RulesModalValues {
  rules: RuleModel[]
}

const RulesModal: React.FC<RulesModalProps & FormikProps<RulesModalValues>> = ({
  isLoading,
  isValid,
  submitForm,
  values: { rules },
  setFieldValue,
  open,
  onClose,
}) => {
  const handleAddRule = React.useCallback(() => {
    setFieldValue('rules', [...rules, { comparator: 'EQ' }])
  }, [rules, setFieldValue])

  return (
    <Modal
      open={open}
      classes={{
        container: 'tr-wc-rulesModal-container',
        header: 'tr-wc-rulesModal-header',
        contentPanel: 'tr-wc-rulesModal-contentPanel',
        content: 'tr-wc-rulesModal-content',
        footer: 'tr-wc-rulesModal-footerContainer',
      }}
      title="Order selectie regels"
      footerContent={
        <>
          <Button color="white" size="small" onClick={handleAddRule}>
            <AddFilter className="tr-wc-buttonVector" />
            Regel toevoegen
          </Button>

          <Button
            color="green"
            size="small"
            disabled={!isValid || isLoading}
            onClick={submitForm}
          >
            {isLoading ? (
              <CircularProgress size={32} thickness={2} />
            ) : (
              <Save className="tr-wc-buttonVector" />
            )}
            Opslaan
          </Button>
        </>
      }
      onClose={onClose}
    >
      <FieldArray
        name="rules"
        render={(arrayHelpers) =>
          rules.map((rule, index) => (
            <Rule
              key={index}
              prefix={`rules.${index}`}
              onRemove={() => arrayHelpers.remove(index)}
            />
          ))
        }
      />

      {!rules.length ? <EmptyView /> : undefined}
    </Modal>
  )
}

export default withFormik<RulesModalProps, RulesModalValues>({
  displayName: 'RulesModalForm',
  validationSchema: RulesSchema,
  validateOnMount: true,
  mapPropsToValues({ rules }): RulesModalValues {
    return {
      rules: rules ?? [],
    }
  },
  handleSubmit({ rules }, { props: { onSaveRules } }) {
    onSaveRules(rules)
  },
})(RulesModal)
