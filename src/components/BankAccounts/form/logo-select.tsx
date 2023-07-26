import { Select, Image, Space } from "antd";
import { bankLogoMap } from "../../../UI/logo-map";
import { useState } from "react";

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

  return (
    <>
      <Space content="horisontal">
        <Image
          width={30}
          src={bankLogoMap.get(bankLogo).img}
          alt={bankLogo}
          preview={false}
        />
        <Select
          defaultValue={bankLogo}
          options={Array.from(bankLogoMap.keys()).map((key) => {
            return {
              value: key,
              label: bankLogoMap.get(key).desc,
            };
          })}
          onChange={handleLogoChange}
        />
      </Space>
    </>
  );
}

export default LogoSelect;
