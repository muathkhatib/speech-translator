import PropTypes from 'prop-types';

function TextBox({ title, body }) {
  return (
    <div style={{
      width: '40%',
      border: '1px solid #D9D9D9',
      borderRadius: '20px',
      boxShadow: '2px 2px 5px 1px #E4E4E4',
    }}
    >
      <h2 style={{ textAlign: 'center', padding: '10px', marginTop: '10px' }}>{title && title}</h2>
      <p style={{
        minHeight: '30vh',
        textAlign: 'center',
        padding: '1rem',
      }}
      >
        {body && body}
      </p>
    </div>
  );
}

TextBox.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default TextBox;
