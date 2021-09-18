
function DonationUpdate({ icon, iconalt, date, message, linkText, linkHref }) {
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
        <h3 className="fs-14 font-book">{message}</h3>
        <a href={linkHref} target="_blank">
          <h3 className="fs-14 font-book color-green text-decoration-underline">{linkText}</h3>
        </a>
      </div>
    </div>
  </div>;
};

export default DonationUpdate;