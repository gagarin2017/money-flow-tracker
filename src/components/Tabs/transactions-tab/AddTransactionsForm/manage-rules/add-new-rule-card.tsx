import { Button, Card, Input, Select, Space } from "antd";
import { Field, useField } from "formik";
import { ManagedProperty } from "../payee-cat-desc-tag-manager";
import ErrorMessage from "../transaction-fields/error-message";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";
import Payee from "../model/payee";
import { ChangeEvent, ChangeEventHandler } from "react";

interface AddNewRuleCardProps {
  name: string;
  fieldPayee: string;
  fieldMatchingString: string;
  handleAddRuleBtnClick: () => void;
}

function AddNewRuleCard({
  name: ruleName,
  fieldPayee,
  fieldMatchingString,
  handleAddRuleBtnClick,
}: AddNewRuleCardProps) {
  const { state } = useImportTransactionsContext();

  const { payees } = state;

  const [, , helperPayee] = useField(fieldPayee);
  const [nameOfRule, , helperRuleName] = useField(ruleName);
  const [matchingString, , helperMatchingString] =
    useField(fieldMatchingString);

  const handleChange = (payeeId: number) => {
    const payee: Payee | undefined = payees.find(
      (payee) => payee.id === payeeId
    );
    helperPayee.setValue(payee);
  };

  const handleRuleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    helperRuleName.setValue(event.target.value);
  };

  const handleMatchingStringChange = (event: ChangeEvent<HTMLInputElement>) => {
    helperMatchingString.setValue(event.target.value);
  };

  const selectablePayees: any[] =
    payees &&
    payees.map((payee) => {
      return { value: payee.id, label: payee.name };
    });

  return (
    <Card title={`Add new ${ManagedProperty.RULE}`}>
      <Space direction="vertical">
        <label htmlFor={ruleName}>{ManagedProperty.RULE} name</label>

        <Input
          id="ruleName"
          name="ruleName"
          placeholder="Rule's Name"
          value={nameOfRule.value}
          onChange={handleRuleNameChange}
        />
        <ErrorMessage key={`${ruleName} Error`} name={ruleName} />

        <label htmlFor={fieldPayee}>Payee</label>
        {payees && payees.length > 0 ? (
          <>
            <Select
              placeholder="Select Payee"
              style={{ width: 120 }}
              onChange={handleChange}
              options={selectablePayees}
            />
          </>
        ) : (
          <h4>No payees</h4>
        )}

        <label htmlFor={fieldMatchingString}>Matching String</label>
        <Input
          id={fieldMatchingString}
          name={fieldMatchingString}
          placeholder="TESCO STORES"
          value={matchingString.value}
          onChange={handleMatchingStringChange}
        />
        <ErrorMessage
          key={`${fieldMatchingString} Error`}
          name={fieldMatchingString}
        />

        <Button
          size="small"
          type="primary"
          style={{ marginTop: 10, float: "right" }}
          onClick={() => handleAddRuleBtnClick()}
        >
          Add {ManagedProperty.RULE}
        </Button>
      </Space>
    </Card>
  );
}

export default AddNewRuleCard;
