import styles from "../../public/styles/Introduction.module.css";

const Introduction = () => {
  return (
    <div className={styles.introDiv}>
      <div className={styles.title}>
        <h1>Peer-to-Peer Tutoring </h1>
      </div>

      <div className={styles.introduction}>
        <p>
          Struggle? Feel lost ? Stress out ? <br />
          Do not understand professional lesson?
          <br /> Do not endure it by yourself
          <br /> Do not hesitate to reach out for help.
        </p>

        <p>Book your peer-tutor today. We are here to help!</p>
      </div>
    </div>
  );
};

export default Introduction;
