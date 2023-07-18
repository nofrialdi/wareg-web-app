import React, { useEffect, useState } from 'react';
import Filter from '@/components/Filter';
import MenuCard from '@/components/MenuCard';

interface Menu {
  id: number;
  name: string;
  price: number;
  categoryId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  calories: string;
  description: string;
  category: {
    name: string;
  };
  ratings: {
    rating: number;
  }[];
  menuImages: {
    img1: string;
    img2: string;
    img3: string;
    img4: string;
  };
}

const MenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 9;

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('https://w17-wareg.onrender.com/menus');
      const data = await response.json();
      setMenus(data.menus);
      setFilteredMenus(data.menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    const selectedCategories = selectedCategory.includes(category)
      ? selectedCategory.filter((item) => item !== category)
      : [...selectedCategory, category];
    setSelectedCategory(selectedCategories);
    filterMenus(selectedCategories, selectedRating);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
    filterMenus(selectedCategory, rating);
  };

  const handleFilterByQuery = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = menus.filter((menu) =>
      menu.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredMenus(filtered);
    setCurrentPage(1);
  };

  const filterMenus = (categories: string[], rating: number | null) => {
    let filtered = menus;

    if (categories.length > 0) {
      filtered = filtered.filter((menu) => categories.includes(menu.category.name));
    }

    if (rating !== null) {
      filtered = filtered.filter(
        (menu) =>
          menu.ratings.length > 0 &&
          Math.floor(
            menu.ratings.reduce((sum, rating) => sum + rating.rating, 0) / menu.ratings.length
          ) === rating
      );
    }

    setFilteredMenus(filtered);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredMenus.length / menusPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const currentMenus = filteredMenus.slice(
    (currentPage - 1) * menusPerPage,
    currentPage * menusPerPage
  );

  return (
    <>
      <div>
        <div className="bg-[#EEF6F4]">
          <h1 className="text-emerald-950 text-[50px] px-5 pb-[40px] font-bold leading-[80px]">
            Menu
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-8 item-center">
          {filteredMenus.length > menusPerPage && (
            <ul className="justify-center gap-8 p-3 mt-10 rounded-full w-1/9 item-center">
              <button
                className="middle none center bg-emerald-600 rounded-l-full hover:bg-emerald-900 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md  transition-all hover:shadow-lg  focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="middle none center bg-emerald-600 rounded-r-full hover:bg-emerald-900 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md  transition-all hover:shadow-lg  focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </ul>
          )}
        </div>
        <div className="flex p-8">
          <div className="w-2/5 p-4">
            <div className="bg-[#F6F6F6] p-8 rounded-xl">
              <Filter
              onFilterByQuery={handleFilterByQuery}
                categories={['Nasi', 'Daging', 'Sayur', 'Minuman', 'Cemilan', 'Ikan']}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onRatingChange={handleRatingChange}
                selectedRating={selectedRating}
                
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center w-4/5 gap-3 p-3">
            {currentMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                id={menu.id}
                name={menu.name}
                price={menu.price}
                category={menu.category.name}
                ratings={menu.ratings.map((rating) => rating.rating)}
                menuImages={menu.menuImages}
              />
            ))}
          </div>
        </div>
      </div>
    <div className="w-[1440px] h-[573px] relative">
        <div className="w-[1440px] h-[566px] left-0 top-0 absolute bg-[#548776]" />
        <div className="w-[591px] h-[312.85px] left-[120px] top-[115.57px] absolute">
          <div className="w-[591px] h-[246.87px] left-0 top-0 absolute">
            <div className="w-[591px] h-[142.24px] left-0 top-0 absolute text-white text-5xl font-semibold capitalize">Diskon 30% dengan aplikasi Wareg</div>
            <div className="w-[558px] h-[94.83px] left-0 top-[152.05px] absolute text-white text-base font-normal leading-loose">Nikmati diskon hingga 30% setiap minggunya dengan menu edisi terbatas yang akan menggoda selera makanmu. Jangan sampai terlewatkan kesempatan ini! Download sekarang juga!</div>
          </div>
          <div className="w-[195px] h-[51.36px] left-0 top-[261.48px] absolute">
            <div className="w-[191px] h-[51.36px] left-0 top-0 absolute bg-white rounded-3xl" />
            <div className="w-[182.65px] h-[23.71px] left-[12.35px] top-[13.83px] absolute text-slate-500 text-base font-semibold">Download  Sekarang</div>
          </div>
        </div>
        <div className="w-[133px] h-[131.38px] left-[1155px] top-[64.21px] absolute">
          <div className="w-[133px] h-[131.38px] left-0 top-0 absolute bg-white rounded-full" />
          <div className="w-[74px] h-[71.12px] left-[30px] top-[30.62px] absolute text-center"><span className="text-2xl font-semibold capitalize text-slate-500">up to <br /></span><span className="text-2xl font-semibold text-red-600 capitalize">30%</span></div>
        </div>
        <div className="w-[1440px] h-[573px] left-0 top-0 absolute">
          <div className="w-[76px] h-[75.07px] left-[554px] top-[425.73px] absolute flex-col justify-start items-start inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
  <path d="M25.959 46.8576C26.7012 47.3799 27.5901 47.6602 28.5014 47.6594C29.4127 47.6585 30.301 47.3766 31.0423 46.8529C31.7871 46.3098 32.3511 45.5597 32.6623 44.6984L34.3109 39.6899C34.7056 38.5096 35.3743 37.4369 36.2636 36.5575C37.1528 35.678 38.2379 35.0163 39.4322 34.6252L44.5916 32.9682C45.4568 32.6616 46.2026 32.0941 46.7237 31.3459C47.2447 30.5976 47.5145 29.7066 47.4951 28.7986C47.4757 27.8906 47.1679 27.0116 46.6154 26.2858C46.0628 25.56 45.2934 25.0241 44.4158 24.7539L39.3372 23.1298C38.142 22.7397 37.0557 22.079 36.1649 21.2005C35.274 20.322 34.6033 19.2499 34.2063 18.0697L32.5293 12.9815C32.2268 12.1401 31.6668 11.4125 30.9272 10.8995C30.1875 10.3865 29.3046 10.1134 28.4009 10.1182C27.4847 10.1144 26.5904 10.3951 25.8445 10.9207C25.0986 11.4462 24.5387 12.1901 24.2439 13.0472L22.5526 18.1636C22.1555 19.3087 21.5013 20.3503 20.6391 21.2103C19.7769 22.0703 18.729 22.7265 17.5738 23.1298L12.4239 24.7773C11.5636 25.0777 10.8195 25.6358 10.2954 26.3738C9.77134 27.1118 9.49332 27.993 9.50012 28.8945C9.50692 29.7961 9.7982 30.673 10.3334 31.4033C10.8685 32.1335 11.6209 32.6805 12.4857 32.9682L17.5548 34.597C18.7512 34.9927 19.8381 35.6581 20.7294 36.5403C21.6207 37.4226 22.2921 38.4977 22.6904 39.6805L24.3627 44.75C24.662 45.5949 25.2226 46.3318 25.9637 46.8529L25.959 46.8576ZM19.0323 30.1143L14.9704 28.8704L19.075 27.5515C20.9481 26.9102 22.6468 25.8518 24.0396 24.4582C25.4269 23.05 26.472 21.3602 27.0991 19.5014L28.3581 15.4693L29.6883 19.5155C30.3203 21.3926 31.3874 23.0979 32.8044 24.4955C34.2214 25.8931 35.9492 26.9444 37.8502 27.5655L42.0309 28.8282L37.9452 30.1425C36.0416 30.7631 34.3118 31.8158 32.8944 33.2163C31.4769 34.6167 30.4114 36.3259 29.7833 38.2067L28.5244 42.2293L27.1989 38.1973C26.5722 36.3134 25.5069 34.6011 24.0885 33.198C22.6701 31.795 20.9383 30.7404 19.0323 30.119V30.1143ZM50.0408 65.7271C50.6868 66.1787 51.4585 66.4214 52.2499 66.4218C53.0471 66.4118 53.8217 66.1583 54.4673 65.6961C55.1129 65.2339 55.5979 64.5856 55.8557 63.8402L57.0339 60.2634C57.2816 59.5185 57.7031 58.8415 58.2642 58.2871C58.8254 57.7327 59.5105 57.3163 60.2645 57.0715L63.9321 55.8887C64.6907 55.6317 65.3475 55.1442 65.8087 54.496C66.2699 53.8477 66.5117 53.072 66.4996 52.2798C66.4874 51.4875 66.222 50.7194 65.7412 50.0852C65.2604 49.4511 64.5889 48.9834 63.8228 48.7492L60.1932 47.5804C59.4421 47.3333 58.7593 46.9173 58.1987 46.365C57.6381 45.8127 57.215 45.1393 56.9627 44.3979L55.7655 40.7648C55.5079 40.0187 55.0192 39.3716 54.3686 38.9152C53.7181 38.4588 52.9386 38.2163 52.1408 38.222C51.3429 38.2278 50.5671 38.4814 49.9233 38.9471C49.2795 39.4127 48.8004 40.0668 48.5537 40.8165L47.3803 44.3932C47.1373 45.1281 46.7264 45.7977 46.1794 46.3504C45.6323 46.9031 44.9639 47.324 44.2258 47.5804L40.5392 48.768C39.9811 48.9597 39.476 49.2773 39.0639 49.6956C38.6518 50.1138 38.344 50.6213 38.1651 51.1776C37.9862 51.7339 37.941 52.3238 38.0331 52.9004C38.1252 53.477 38.3522 54.0245 38.6958 54.4993C39.1662 55.1564 39.8313 55.6493 40.5962 55.9074L44.221 57.0668C44.9749 57.316 45.6595 57.7355 46.2203 58.2921C46.7811 58.8486 47.2028 59.5269 47.4516 60.2728L48.6535 63.9059C48.9138 64.6403 49.3985 65.2767 50.0408 65.7271ZM45.6985 52.617L44.8529 52.3401L45.727 52.0396C47.1677 51.5469 48.4742 50.7329 49.5453 49.6609C50.6163 48.5888 51.4231 47.2875 51.9031 45.8577L52.1786 45.0222L52.4637 45.8718C52.9474 47.3111 53.7644 48.619 54.8498 49.6914C55.9352 50.7638 57.259 51.5711 58.7157 52.049L59.6421 52.3447L58.787 52.6217C57.327 53.1017 56.0008 53.9124 54.9144 54.989C53.828 56.0656 53.0115 57.3784 52.5302 58.8224L52.2499 59.672L51.9743 58.8224C51.4932 57.3755 50.6751 56.0603 49.586 54.9825C48.4969 53.9048 47.167 53.0946 45.7033 52.617H45.6985Z" fill="white"/>
</svg>
            </div>
          <div className="w-[55px] h-[54.33px] left-[799px] top-[61.24px] absolute flex-col justify-start items-start inline-flex">
<svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none">
  <path d="M18.7861 33.6214C19.3233 33.9994 19.9665 34.2023 20.626 34.2017C21.2855 34.2011 21.9284 33.997 22.4648 33.618C23.0038 33.225 23.412 32.6822 23.6372 32.0588L24.8302 28.4343C25.1159 27.5801 25.5999 26.8038 26.2434 26.1674C26.8869 25.531 27.6722 25.0521 28.5365 24.769L32.2702 23.5699C32.8964 23.348 33.4361 22.9373 33.8132 22.3958C34.1902 21.8544 34.3855 21.2095 34.3715 20.5524C34.3574 19.8953 34.1347 19.2592 33.7348 18.7339C33.3349 18.2087 32.7781 17.8209 32.143 17.6253L28.4677 16.45C27.6028 16.1677 26.8166 15.6896 26.1719 15.0538C25.5273 14.418 25.0419 13.6421 24.7546 12.7881L23.5409 9.10586C23.322 8.49695 22.9168 7.97039 22.3815 7.59912C21.8462 7.22786 21.2073 7.03027 20.5533 7.03374C19.8902 7.03095 19.2431 7.23409 18.7033 7.61445C18.1634 7.99481 17.7583 8.53315 17.5449 9.15341L16.321 12.8561C16.0336 13.6848 15.5602 14.4385 14.9362 15.0609C14.3122 15.6833 13.5539 16.1582 12.7179 16.45L8.991 17.6423C8.36839 17.8597 7.82992 18.2636 7.45065 18.7977C7.07137 19.3318 6.87017 19.9694 6.87509 20.6219C6.88001 21.2743 7.0908 21.9089 7.47809 22.4374C7.86538 22.9658 8.40987 23.3617 9.03569 23.5699L12.7041 24.7487C13.57 25.035 14.3565 25.5165 15.0015 26.155C15.6466 26.7935 16.1324 27.5715 16.4207 28.4275L17.6309 32.0962C17.8475 32.7076 18.2532 33.241 18.7895 33.618L18.7861 33.6214ZM13.7734 21.5046L10.8338 20.6044L13.8043 19.6499C15.1598 19.1859 16.3891 18.4199 17.3971 17.4113C18.401 16.3922 19.1574 15.1694 19.6112 13.8242L20.5223 10.9062L21.485 13.8344C21.9423 15.1928 22.7145 16.4269 23.74 17.4383C24.7655 18.4498 26.0159 19.2106 27.3916 19.6601L30.4171 20.5738L27.4604 21.525C26.0828 21.9741 24.8309 22.7359 23.8051 23.7494C22.7794 24.7629 22.0083 25.9998 21.5537 27.3609L20.6426 30.2721L19.6834 27.3541C19.2299 25.9908 18.4589 24.7516 17.4325 23.7362C16.406 22.7209 15.1527 21.9577 13.7734 21.508V21.5046ZM36.2137 47.277C36.6812 47.6038 37.2397 47.7794 37.8124 47.7798C38.3893 47.7725 38.9499 47.5891 39.4171 47.2546C39.8843 46.9201 40.2353 46.4509 40.4219 45.9115L41.2746 43.323C41.4538 42.7839 41.7588 42.294 42.1649 41.8928C42.571 41.4915 43.0668 41.1902 43.6124 41.0131L46.2666 40.1571C46.8156 39.9711 47.291 39.6183 47.6247 39.1492C47.9585 38.6801 48.1335 38.1187 48.1247 37.5454C48.1159 36.972 47.9238 36.4161 47.5759 35.9572C47.2279 35.4983 46.742 35.1599 46.1876 34.9904L43.5609 34.1445C43.0173 33.9657 42.5232 33.6646 42.1175 33.2649C41.7118 32.8653 41.4056 32.378 41.223 31.8414L40.3566 29.2122C40.1702 28.6723 39.8165 28.204 39.3457 27.8737C38.8749 27.5434 38.3108 27.3679 37.7334 27.372C37.1561 27.3762 36.5946 27.5597 36.1287 27.8967C35.6628 28.2337 35.316 28.707 35.1376 29.2496L34.2884 31.838C34.1125 32.3698 33.8151 32.8544 33.4193 33.2544C33.0234 33.6544 32.5396 33.959 32.0055 34.1445L29.3375 35.004C28.9337 35.1427 28.5681 35.3725 28.2699 35.6752C27.9717 35.9779 27.749 36.3452 27.6195 36.7478C27.49 37.1504 27.4573 37.5773 27.524 37.9945C27.5906 38.4118 27.7549 38.808 28.0036 39.1516C28.3439 39.6272 28.8253 39.9838 29.3788 40.1707L32.0021 41.0097C32.5476 41.19 33.043 41.4936 33.4489 41.8964C33.8548 42.2992 34.1599 42.79 34.34 43.3298L35.2098 45.959C35.3981 46.4905 35.7489 46.9511 36.2137 47.277ZM33.0713 37.7894L32.4593 37.589L33.0919 37.3716C34.1345 37.015 35.08 36.4259 35.8551 35.6501C36.6302 34.8743 37.2141 33.9325 37.5614 32.8979L37.7608 32.2932L37.9671 32.9081C38.3172 33.9497 38.9085 34.8962 39.694 35.6722C40.4794 36.4483 41.4374 37.0325 42.4916 37.3784L43.1621 37.5924L42.5432 37.7928C41.4866 38.1402 40.5269 38.7269 39.7407 39.506C38.9545 40.2852 38.3636 41.2352 38.0153 42.2802L37.8124 42.895L37.613 42.2802C37.2648 41.2331 36.6728 40.2813 35.8846 39.5013C35.0964 38.7214 34.134 38.1351 33.0747 37.7894H33.0713Z" fill="white"/>
</svg> </div>
          <div className="w-[1440px] h-[573px] left-0 top-0 absolute">
            <div className="w-[215px] h-[215px] left-[-95px] top-[9px] absolute flex-col justify-start items-start inline-flex"/> <svg xmlns="http://www.w3.org/2000/svg" width="120" height="215" viewBox="0 0 120 215" fill="none">
  <path d="M-21.5635 132.094C-19.4636 133.59 -16.9491 134.393 -14.3711 134.391C-11.793 134.388 -9.28004 133.581 -7.18295 132.081C-5.07603 130.525 -3.48045 128.377 -2.59999 125.91L2.06361 111.567C3.18037 108.186 5.07215 105.114 7.58778 102.595C10.1034 100.077 13.1731 98.1817 16.5517 97.0615L31.1472 92.3161C33.5949 91.438 35.7048 89.8126 37.1788 87.6697C38.6527 85.5269 39.4162 82.9749 39.3612 80.3745C39.3062 77.774 38.4356 75.2566 36.8725 73.178C35.3093 71.0993 33.1326 69.5646 30.65 68.7907L16.2829 64.1394C12.9018 63.0223 9.82865 61.1302 7.30851 58.6141C4.78837 56.098 2.89105 53.0276 1.76794 49.6478L-2.9763 35.0755C-3.8322 32.6657 -5.41615 30.5819 -7.50871 29.1127C-9.60127 27.6434 -12.0989 26.8615 -14.6555 26.8752C-17.2473 26.8641 -19.777 27.6681 -21.8872 29.1733C-23.9974 30.6785 -25.5814 32.809 -26.4152 35.2637L-31.1998 49.9166C-32.3233 53.1962 -34.1739 56.1792 -36.6131 58.6422C-39.0522 61.1052 -42.0167 62.9845 -45.2847 64.1394L-59.8534 68.8579C-62.2872 69.7182 -64.3921 71.3166 -65.8747 73.4302C-67.3574 75.5438 -68.1439 78.0674 -68.1247 80.6493C-68.1054 83.2312 -67.2814 85.7428 -65.7675 87.8341C-64.2535 89.9254 -62.125 91.4922 -59.6787 92.3161L-45.3384 96.9809C-41.9538 98.1142 -38.8791 100.02 -36.3576 102.546C-33.8361 105.073 -31.9368 108.152 -30.8101 111.54L-26.0793 126.058C-25.2325 128.478 -23.6467 130.589 -21.5501 132.081L-21.5635 132.094ZM-41.1587 84.1427L-52.6497 80.5803L-41.0377 76.8028C-35.7388 74.9664 -30.9334 71.9352 -26.9932 67.9438C-23.0687 63.9109 -20.112 59.0714 -18.338 53.7479L-14.7764 42.2003L-11.0133 53.7882C-9.22539 59.1642 -6.20682 64.0481 -2.19814 68.0507C1.81054 72.0534 6.6985 75.0642 12.0762 76.8431L23.9032 80.4593L12.345 84.2234C6.95991 86.0007 2.06618 89.0157 -1.9436 93.0264C-5.95339 97.0372 -8.96761 101.932 -10.7445 107.319L-14.306 118.839L-18.0557 107.292C-19.8285 101.896 -22.8424 96.9924 -26.8549 92.9742C-30.8675 88.956 -35.7667 85.9357 -41.1587 84.1562V84.1427ZM46.5627 186.135C48.3902 187.429 50.5735 188.124 52.8121 188.125C55.0674 188.096 57.2586 187.37 59.085 186.047C60.9114 184.723 62.2835 182.866 63.0129 180.731L66.346 170.488C67.0467 168.354 68.2389 166.415 69.8264 164.828C71.4138 163.24 73.3522 162.047 75.485 161.346L85.8605 157.959C88.0065 157.223 89.8648 155.827 91.1694 153.97C92.474 152.114 93.1581 149.892 93.1238 147.623C93.0895 145.354 92.3385 143.154 90.9784 141.338C89.6183 139.522 87.7187 138.183 85.5514 137.512L75.2834 134.164C73.1585 133.457 71.227 132.265 69.6411 130.684C68.0551 129.102 66.8581 127.173 66.1444 125.05L62.7576 114.645C62.0289 112.508 60.6464 110.655 58.806 109.348C56.9656 108.041 54.7606 107.346 52.5035 107.363C50.2464 107.379 48.0517 108.105 46.2304 109.439C44.4091 110.773 43.0536 112.646 42.356 114.793L39.0364 125.037C38.349 127.141 37.1865 129.059 35.639 130.642C34.0915 132.225 32.2004 133.43 30.1124 134.164L19.6831 137.566C18.1045 138.115 16.6755 139.024 15.5097 140.222C14.3438 141.42 13.4733 142.873 12.9671 144.467C12.4609 146.06 12.3331 147.749 12.5937 149.401C12.8543 151.052 13.4962 152.62 14.4685 153.98C15.799 155.862 17.6806 157.273 19.8444 158.012L30.0989 161.333C32.2316 162.046 34.1682 163.248 35.7548 164.842C37.3414 166.436 38.5341 168.378 39.238 170.515L42.6382 180.92C43.3745 183.023 44.7458 184.845 46.5627 186.135ZM34.2787 148.589L31.8864 147.796L34.3594 146.935C38.435 145.524 42.1311 143.193 45.1609 140.123C48.1908 137.052 50.4732 133.326 51.831 129.231L52.6105 126.838L53.4169 129.271C54.7854 133.393 57.0968 137.139 60.1673 140.21C63.2378 143.282 66.9826 145.594 71.1037 146.962L73.7244 147.809L71.3053 148.602C67.175 149.977 63.4233 152.299 60.35 155.382C57.2767 158.466 54.9669 162.225 53.6051 166.361L52.8121 168.794L52.0326 166.361C50.6715 162.217 48.3573 158.45 45.2762 155.364C42.195 152.277 38.4329 149.957 34.2922 148.589H34.2787Z" fill="white"/>
</svg>
            <div className="w-[215px] h-[215px] left-[1300px] top-[373px] absolute flex-col justify-start items-start inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="200" viewBox="0 0 140 200" fill="none">
  <path d="M73.4365 132.094C75.5364 133.59 78.0509 134.393 80.6289 134.391C83.207 134.388 85.72 133.581 87.817 132.081C89.924 130.525 91.5196 128.377 92.4 125.91L97.0636 111.567C98.1804 108.186 100.072 105.114 102.588 102.595C105.103 100.077 108.173 98.1817 111.552 97.0615L126.147 92.3161C128.595 91.438 130.705 89.8126 132.179 87.6697C133.653 85.5269 134.416 82.9749 134.361 80.3745C134.306 77.774 133.436 75.2566 131.872 73.178C130.309 71.0993 128.133 69.5646 125.65 68.7907L111.283 64.1394C107.902 63.0223 104.829 61.1302 102.309 58.6141C99.7884 56.098 97.8911 53.0276 96.7679 49.6478L92.0237 35.0755C91.1678 32.6657 89.5839 30.5819 87.4913 29.1127C85.3987 27.6434 82.9011 26.8615 80.3445 26.8752C77.7527 26.8641 75.223 27.6681 73.1128 29.1733C71.0026 30.6785 69.4186 32.809 68.5848 35.2637L63.8002 49.9166C62.6767 53.1962 60.8261 56.1792 58.3869 58.6422C55.9478 61.1052 52.9833 62.9845 49.7153 64.1394L35.1466 68.8579C32.7128 69.7182 30.6079 71.3166 29.1253 73.4302C27.6426 75.5438 26.8561 78.0674 26.8753 80.6493C26.8946 83.2312 27.7186 85.7428 29.2325 87.8341C30.7465 89.9254 32.875 91.4922 35.3213 92.3161L49.6616 96.9809C53.0462 98.1142 56.1209 100.02 58.6424 102.546C61.1639 105.073 63.0632 108.152 64.1899 111.54L68.9207 126.058C69.7675 128.478 71.3533 130.589 73.4499 132.081L73.4365 132.094ZM53.8413 84.1427L42.3503 80.5803L53.9623 76.8028C59.2612 74.9664 64.0666 71.9352 68.0068 67.9438C71.9313 63.9109 74.888 59.0714 76.662 53.7479L80.2236 42.2003L83.9867 53.7882C85.7746 59.1642 88.7932 64.0481 92.8019 68.0507C96.8105 72.0534 101.699 75.0642 107.076 76.8431L118.903 80.4593L107.345 84.2234C101.96 86.0007 97.0662 89.0157 93.0564 93.0264C89.0466 97.0372 86.0324 101.932 84.2555 107.319L80.694 118.839L76.9443 107.292C75.1715 101.896 72.1576 96.9924 68.1451 92.9742C64.1325 88.956 59.2333 85.9357 53.8413 84.1562V84.1427ZM141.563 186.135C143.39 187.429 145.573 188.124 147.812 188.125C150.067 188.096 152.259 187.37 154.085 186.047C155.911 184.723 157.283 182.866 158.013 180.731L161.346 170.488C162.047 168.354 163.239 166.415 164.826 164.828C166.414 163.24 168.352 162.047 170.485 161.346L180.861 157.959C183.007 157.223 184.865 155.827 186.169 153.97C187.474 152.114 188.158 149.892 188.124 147.623C188.089 145.354 187.339 143.154 185.978 141.338C184.618 139.522 182.719 138.183 180.551 137.512L170.283 134.164C168.159 133.457 166.227 132.265 164.641 130.684C163.055 129.102 161.858 127.173 161.144 125.05L157.758 114.645C157.029 112.508 155.646 110.655 153.806 109.348C151.966 108.041 149.761 107.346 147.503 107.363C145.246 107.379 143.052 108.105 141.23 109.439C139.409 110.773 138.054 112.646 137.356 114.793L134.036 125.037C133.349 127.141 132.186 129.059 130.639 130.642C129.091 132.225 127.2 133.43 125.112 134.164L114.683 137.566C113.104 138.115 111.675 139.024 110.51 140.222C109.344 141.42 108.473 142.873 107.967 144.467C107.461 146.06 107.333 147.749 107.594 149.401C107.854 151.052 108.496 152.62 109.469 153.98C110.799 155.862 112.681 157.273 114.844 158.012L125.099 161.333C127.232 162.046 129.168 163.248 130.755 164.842C132.341 166.436 133.534 168.378 134.238 170.515L137.638 180.92C138.374 183.023 139.746 184.845 141.563 186.135ZM129.279 148.589L126.886 147.796L129.359 146.935C133.435 145.524 137.131 143.193 140.161 140.123C143.191 137.052 145.473 133.326 146.831 129.231L147.611 126.838L148.417 129.271C149.785 133.393 152.097 137.139 155.167 140.21C158.238 143.282 161.983 145.594 166.104 146.962L168.724 147.809L166.305 148.602C162.175 149.977 158.423 152.299 155.35 155.382C152.277 158.466 149.967 162.225 148.605 166.361L147.812 168.794L147.033 166.361C145.671 162.217 143.357 158.45 140.276 155.364C137.195 152.277 133.433 149.957 129.292 148.589H129.279Z" fill="white"/>
</svg> </div>
          </div>
        </div>
      </div></>
  );
};

export default MenuPage;



