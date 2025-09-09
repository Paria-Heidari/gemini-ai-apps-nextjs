import styles from "./page.module.css";
import PromptForm from "./components/PromptForm";


export default function Home() {

  return (
    <main>
      <div className={styles.page}>
        <PromptForm/>
      </div>
    </main>
  );
}
