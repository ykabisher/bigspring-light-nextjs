import config from "@config/config.json";
import { markdownify } from "@lib/utils/textConverter";

const TermsOfUse = ({ data }) => {
  const { frontmatter } = data;
  const { title, info } = frontmatter;
  const { contact_form_action } = config.params;

  return (
    <section className="section">
      <div className="container">
      </div>
    </section>
  );
};

export default TermsOfUse;
