
function DonationUpdate({ icon, iconalt, date, message, link }) {
  return <div className="notification-card">
    <div className="tag d-flex justify-content-start">
      <div className="icon-avatar mr-2">
        <img 
          src={icon}
          alt={iconalt}
          height="20"
        />
      </div>
      <div className="content">
        <h5 className="fs-12 font-bold text">{date}</h5>
        <h3 className="fs-14 font-book">{message}<i className="fas fa-external-link-alt fs-9 color-light"></i></h3>
        <a href="#">
          <h3 class="fs-14 font-book color-green text-decoration-underline">{link}</h3>
        </a>
      </div>
    </div>
  </div>;
};

export default DonationUpdate;