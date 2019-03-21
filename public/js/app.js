// Creating a reusable Ajax request with a callback
const request = (options, cb) => {
  $.ajax(options)
    .done(response => cb(response))
    .fail(err => console.log(`Err: ${err}`))
    .always(() => console.log('Request completed.'));
};

const createQuoteEl = quoteObj => {
  return `<div class="card">
  <div class="card-header" id="${quoteObj._id}">
    <h5 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${
        quoteObj._id
      }" aria-expanded="true" aria-controls="${
    quoteObj._id
  }" style="visibility: visible;">${quoteObj.quote}</button>
      <div>
        <form class="quote-update-frm" style="visibility: hidden;">
          <input type="text" name="editquote" class="edit-quote" value="${
            quoteObj.quote
          }">
          <input type="submit" class="btn-small btn-primary" value="Update">
        </form>
      </div>
    </h5>

    <span>
      <form class="quote-edit-frm"><input type="submit" class="btn btn-secondary btn-sm" value="Edit"></form>
      <form class="quote-delete-frm"><input type="submit" class="btn btn-secondary btn-sm" value="Delete"></form>
    </span>

  </div>
</div>`;
};

// Issue a request to get the list of quotes from the backend server
const loadQuotes = () => {
  // Options for the request
  const reqOptions = {
    url: '/quotes',
    method: 'GET',
    dataType: 'json',
  };

  // calling the request function with the options and callback
  request(reqOptions, function(quotesArr) {
    // loop through the array of quote objects
    renderQuotes(quotesArr);
  });
};

// loop through the array of quote objects
// inside the loop, create each HTML element of each quote
// adding each quote HTML element to the DOM
const renderQuotes = quotesArr => {
  // Need to empty the container, in case render is called many times
  // $('#quote-list').empty();

  for (const quoteObj of quotesArr) {
    // create an HTML element out of quoteObj
    const quoteEl = createQuoteEl(quoteObj);
    // Add the element to the DOM
    $('#quote-list').prepend(quoteEl);
  }
};

$(document).ready(function() {
  // When clicking add button, issue a request to create a new quote
  $('#add-quote-frm').on('submit', function(event) {
    event.preventDefault();

    // Extract the content of the input box
    // Use DOM traversal to get the content
    const quoteContent = $(this)
      .find('input[type=text]')
      .val();

    // Do some king of validation but not with alerts! :)
    if (!quoteContent) {
      alert('Put something in the box!');
    } else {
      // Creating the request options for creating a new quote
      const reqOptions = {
        url: '/quotes',
        method: 'POST',
        data: { quote: quoteContent },
      };

      // sending the ajax POST request to the backend
      request(reqOptions, function(quoteObj) {
        // If we want to add only the new quote
        renderQuotes([quoteObj]);

        // If we want to reload all the quotes
        // loadQuotes();
      });
    }
  });

  loadQuotes();
}); // document ready
