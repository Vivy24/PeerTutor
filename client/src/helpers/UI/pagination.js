import { useState } from "react";
import styles from "../../public/styles/pagination.module.css";

const Pagination = ({ data, RenderComponent, title, pageLimit, dataLimit }) => {
  const [pages] = useState(Math.round(data.length / dataLimit));
  const [currentPage, setCurrentPage] = useState(1);

  function goToNextPage() {
    setCurrentPage((page) => {
      return page + 1;
    });
  }

  function goToPreviousPage() {
    setCurrentPage((page) => {
      if (page > 1) {
        return page - 1;
      }
      return page;
    });
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
    // not yet implemented
  };

  const getPaginationGroup = () => {
    pageLimit = pageLimit > pages ? pages : pageLimit;

    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;

    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <div>
      {/* show the posts, 10 posts at a time */}
      <div className={styles.dataContainer}>
        {getPaginatedData().map((d, idx) => (
          <RenderComponent key={idx} review={d} />
        ))}
      </div>
      {/* show the pagiantion
        it consists of next and previous buttons
        along with page numbers, in our case, 5 page
        numbers at a time
    */}
      <div className={styles.pagination}>
        {/* previous button */}
        <button
          onClick={goToPreviousPage}
          className={`${styles.prev} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
        >
          prev
        </button>

        {/* show page numbers */}
        {getPaginationGroup().map((item, index) => (
          <button
            key={index}
            onClick={changePage}
            value={item}
            className={`${styles.paginationItem} ${
              currentPage === item ? styles.active : ""
            }`}
          >
            <span>{item}</span>
          </button>
        ))}

        {/* next button */}
        <button
          onClick={goToNextPage}
          className={`${styles.next} ${
            currentPage === pages ? styles.disabled : ""
          }`}
        >
          next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
