// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
  var articleSection = $("<div>");
  articleSection.addClass("card-text");
  articleSection.attr("id", "articleId-" + i);
  $("#articleSection").append(articleSection); 
  
  $("#articleId-" + i).append("<h6>" + data[i].title + "</h6>");
  $("#articleId-" + i).append("<a href=" + data[i].link + ">" + "Go to Article" + "</a>");
  $("#articleId-" + i).append("<br />");
  $("#articleId-" + i).append("<button id='addNote' class='btn btn-success' data-id='" + data[i]._id + "'>Add/Update Note</button>");
  $("#articleId-" + i).append("<button id='delete-article' class='btn btn-danger' data-id='" + data[i]._id + "'>Delete Article</button>");
  $("#articleId-" + i).append("<br /><br /><br />"); 
    }
    
  });
  // Scrape Button
  $("#scrape").on("click", function() {
    $.ajax({
      //new scrape call to refresh articles
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      console.log(data);
      console.log("Scrapped");
      window.location.href = "/";
    });
  });
  // Whenever someone clicks a p tag
  $(document).on("click", "#addNote", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h3 class='card-title'>" + data.title + "</h3>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' value='New Title'>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' value='New Note'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(
          "<button data-id='" + data._id + "' id='savenote'>Save/Update Note</button>"
        );
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
    });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  
    // Delete Article Button
     $(document).on("click", "#delete-article", function() {
      console.log("Article Deleted");
      var thisId = $(this).attr("data-id"); // Save the id from the p tag
      console.log(thisId);
      //Send the DELETE request.
      $.ajax({
        method: "DELETE",
        url: "/delete/articles/" + thisId
      }).then(function() {
        console.log("deleted article", thisId);
        location.reload();
      });
    });
  