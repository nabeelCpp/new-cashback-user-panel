//----------
//  React Imports
//----------
import { useContext } from "react";

//----------
//  Local Imports
//----------
import { AbilityContext } from "src/layouts/components/acl/Can";

const CanViewNavSectionTitle = (props) => {
  
  const { children, navTitle } = props;
  const ability = useContext(AbilityContext);

  return ability && ability.can(navTitle?.action, navTitle?.subject) ? (
    <>{children}</>
  ) : null;
};

export default CanViewNavSectionTitle;
