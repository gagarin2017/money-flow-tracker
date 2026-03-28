import { Button, Card, Input, Select, Space } from "antd";
import { useField } from "formik";
import { ChangeEvent } from "react";
import { useImportTransactionsContext } from "../../../../../context/import-transactions-context";
import Payee from "../model/payee";
import { ManagedProperty } from "../payee-cat-desc-tag-manager";
import ErrorMessage from "../transaction-fields/error-message";

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

  const [payee, meta, helperPayee] = useField(fieldPayee);
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
      <Space direction="vertical" size={"large"}>
        <div>
          <label htmlFor={ruleName}>{ManagedProperty.RULE} name</label>

          <Input
            id="ruleName"
            name="ruleName"
            placeholder="Rule's Name"
            value={nameOfRule.value}
            onChange={handleRuleNameChange}
            style={{ marginTop: 5 }}
          />
          <ErrorMessage key={`${ruleName} Error`} name={ruleName} />
        </div>

        <div>
          <label htmlFor={fieldPayee}>Payee</label>
          {payees && payees.length > 0 ? (
            <div style={{ width: 120, marginTop: 5 }}>
              <Select
                placeholder="Select Payee"
                onChange={handleChange}
                options={selectablePayees}
              />
            </div>
          ) : (
            <div style={{ fontWeight: "bold" }}>No payees</div>
          )}
          {meta.touched && meta.error && (
            <div style={{ color: "red" }}>{meta.error}</div>
          )}
        </div>
        <div>
          <label htmlFor={fieldMatchingString}>Matching String</label>
          <Input
            id={fieldMatchingString}
            name={fieldMatchingString}
            placeholder="TESCO STORES"
            value={matchingString.value}
            style={{ marginTop: 5 }}
            onChange={handleMatchingStringChange}
          />
          <ErrorMessage
            key={`${fieldMatchingString} Error`}
            name={fieldMatchingString}
          />
        </div>
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
