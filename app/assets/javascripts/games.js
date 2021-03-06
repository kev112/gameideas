$(() => {
    class Game {
        constructor(attributes) {
            this.id = attributes.id;
            this.title = attributes.title;
            this.summary = attributes.summary;
        }
    }
    Game.templateSource = $('#games-template').html();
    Game.template = Handlebars.compile(Game.templateSource);

    Game.renderGames = (games) => {
        let $ol = $('.all-games ol'); 
        $ol.html("");
        
        games.forEach(json => {
            game = new Game(json);
            $ol.append(game.gameLi());
        });
    }

    Game.prototype.gameLi = function() {
        return Game.template(this)
    }

    /////// Sort by Oldest & Newest Games ///////
    function bindEventListerners() {
        $('a.sort-game-by-suggestion-count').on('click', function(e) {
            $.get(this.href).success(function(response) {
                response.sort(function(a, b) {
                    var suggestionA = a.suggestions.length;
                    var suggestionB = b.suggestions.length;
                    if (suggestionA !== suggestionB) {
                        return suggestionA - suggestionB
                    }
                });
                bindEventListerners(); 
                Game.renderGames(response);
            });
            e.preventDefault(); 
        });

        $('a.sort-game-alphabetically').on('click', function(e) {
            $.get(this.href).success(function(response) {
                response.sort(function(a, b) {
                    var suggestionA = a.suggestions.length;
                    var suggestionB = b.suggestions.length;
                    if (suggestionA !== suggestionB) {
                        return suggestionA - suggestionB
                    }

                    var nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                  
                    // names must be equal
                    return 0;
                });
                bindEventListerners(); 
                Game.renderGames(response);
            });
            e.preventDefault(); 
        });

        $('a.sort-game-newest').on('click', function(e) {
            $.get(this.href).success(function(response) {
                bindEventListerners(); 
                Game.renderGames(response);
            });
            e.preventDefault(); 
        });

        $('a.sort-game-oldest').on('click', function(e) {
            $.get(this.href).success(function(response) {
                $('.sort-games').html(
                    '<p class="sort-games">All games: Oldest to Newest | <a href="/games/newest_to_oldest" , class="sort-game-newest">Newest to Oldest</a></p>'
                );
                bindEventListerners();                         
                Game.renderGames(response);
            });
            e.preventDefault(); 
        });
    }
    
    bindEventListerners();
})

/////// Prev & Next Game ///////
$(function () {
    const renderGame = (data) => {
        $(".username").text('Created by ' + data["user"]["username"]);
        $(".genre").text('Genre: ' + data["genre"]['name']) ;
        $(".gameTitle").text(data["title"]) ;
        $(".gameSummary").text(data["summary"]);
        // re-set the id to current on the link
        $(".js-next").attr("data-id", data["id"]);
        // re-set id in load suggestions link
        $('a.load_suggestions').attr('href', "/games/" + data["id"] + "/suggestions");
        // clear any loaded suggestions
        $('.suggestions ol').text('');
        // re-set id in suggestions form
        $('#new_suggestion').attr('action', "/games/" + data["id"] + "/suggestions");
        // re_enable submit button
        $('#new_suggestion input').prop('disabled', false);
        // clear textarea
        $('#new_suggestion textarea').val('');
    }

    $(".js-next").on("click", (event) => {
      event.preventDefault();
      let nextId = parseInt($(".js-next").attr("data-id")) + 1;

      $.get("/games/" + nextId + ".json", renderGame);
    });
  
    $(".js-prev").on("click", (event) => {
      event.preventDefault();
      let nextId = parseInt($(".js-next").attr("data-id")) - 1;

      $.get("/games/" + nextId + ".json", renderGame);
    });
});


