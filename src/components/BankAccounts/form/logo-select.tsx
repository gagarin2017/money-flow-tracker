import { Select, Image, Space } from "antd";
import { bankLogoMap } from "../../../UI/logo-map";
import { useState } from "react";
import { sortSelectOptions } from "../../../utils/bank-account-helper";
import { DefaultOptionType } from "antd/es/select";

interface LogoSelectProps {
  formikFieldName: string;
  setFieldValue: (fieldName: string, selectedLogo: String) => void;
  setFieldTouched: (fieldName: string) => void;
  defaultLogo: string;
}

function LogoSelect({
  formikFieldName,
  setFieldValue,
  setFieldTouched,
  defaultLogo,
}: LogoSelectProps) {
  const [bankLogo, setBankLogo] = useState<string>(defaultLogo);

  const handleLogoChange = (bankLogoMapKey: string) => {
    setBankLogo(bankLogoMapKey);
    setFieldValue(formikFieldName, bankLogoMapKey);
    setFieldTouched(formikFieldName);
  };

  const selectBankAccountOptions: DefaultOptionType[] = Array.from(
    bankLogoMap.keys()
  ).map((key) => {
    return {
      value: key,
      label: bankLogoMap.get(key)?.name,
    };
  });

  const sortedBankAccountOptions = sortSelectOptions(selectBankAccountOptions);

  return (
    <>
      <Space content="horisontal">
        <Image
          width={30}
          src={bankLogoMap.get(bankLogo)?.logo}
          alt={bankLogo}
          preview={false}
        />
        <Select
          defaultValue={bankLogo}
          options={sortedBankAccountOptions}
          onChange={handleLogoChange}
          style={{ minWidth: 140 }}
          data-testid="bankLogoSelect"
        />
      </Space>
    </>
  );
}

export default LogoSelect;
