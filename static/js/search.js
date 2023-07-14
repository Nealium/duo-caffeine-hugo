summaryInclude=60;
var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize:true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name:"title",weight:0.8},
    {name:"contents",weight:0.5},
    {name:"series",weight:0.4},
    {name:"tags",weight:0.3},
  ]
};

function executeSearch(searchQuery){
  $.getJSON( "/index.json", function( data ) {
    var pages = data;
    var fuse = new Fuse(pages, fuseOptions);
    var result = fuse.search(searchQuery);
    console.log({"matches":result});
    if(result.length > 0){
      populateResults(searchQuery, result);
    }else{
      $('#search-results').append("<p>No matches found</p>");
    }
  });
}

function renderTagList(tags){
  let tag_list = $('<ul></ul>').addClass('tags_list');

  $.each(tags, function(index, tag){
    tag_list.append(
      $('<li></li>')
        .append(
          $('<a></a>')
            .attr('href', ('/tags/' + tag))
            .addClass('tag_item')
            .append(
              $('<div></div>')
                .addClass('tags_'+tag)
                .html(tag)
            )

        )
    );
  });
  return tag_list;
}

function renderResult(key, snippet, item){
  let result = $('<article></article>')
    .addClass("list")
    .attr('id', 'summary-'+key)
    .append(
      $('<header></header>')
        .addClass('article_header')
        .append(
          $('<h2></h2>')
            .addClass('article_title')
            .append(
              $('<a></a>')
                .attr('href', item.permalink)
                .html(item.title)
            )
        )
    )
    .append(
      $('<div></div>')
        .addClass('article_meta')
        .append(
          $('<div></div>')
            .addClass('article_meta_publish')
            .append(
              $('<time></time>')
                .attr('datetime', item.publishdate)
                .html(item.publishdate)
            )
        )
        .append(
          $('<div></div>')
            .addClass('article_tags')
            .append(renderTagList(item.tags))
        )
    )
    .append(
      $('<p></p>').html(snippet)
    );

  if (item.series){
    result.append(
      $('<p></p>').html('Series: ' + item.series)
    );
  }
  return result;
}

function populateResults(searchQuery, result){
  $.each(result,function(key,value){
    var contents= value.item.contents;
    var snippet = "";
    var snippetHighlights=[];
    var tags =[];
    if( fuseOptions.tokenize ){
      snippetHighlights.push(searchQuery);
    }else{
      $.each(value.matches,function(matchKey,mvalue){
        if(mvalue.key == "tags" || mvalue.key == "series" ){
          snippetHighlights.push(mvalue.value);
        }else if(mvalue.key == "contents"){
          start = mvalue.indices[0][0]-summaryInclude>0?mvalue.indices[0][0]-summaryInclude:0;
          end = mvalue.indices[0][1]+summaryInclude<contents.length?mvalue.indices[0][1]+summaryInclude:contents.length;
          snippet += contents.substring(start,end);
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0],mvalue.indices[0][1]-mvalue.indices[0][0]+1));
        }
      });
    }

    if(snippet.length<1){
      snippet += contents.substring(0,summaryInclude*2);
    }

    let result = renderResult(key, snippet, value.item);
    $('#search-results').append(result);

    $.each(snippetHighlights,function(snipkey,snipvalue){
      $("#summary-"+key).mark(snipvalue);
    });

  });
}

function param(name) {
  return decodeURIComponent((location.search.split(name + '=')[1] || '').split('&')[0]).replace(/\+/g, ' ');
}

function render(templateString, data) {
  var conditionalMatches,conditionalPattern,copy;
  conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
  //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
    if(data[conditionalMatches[1]]){
      //valid key, remove conditionals, leave contents.
      copy = copy.replace(conditionalMatches[0],conditionalMatches[2]);
    }else{
      //not valid, remove entire section
      copy = copy.replace(conditionalMatches[0],'');
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}

$(function () {
  let searchQuery = param('s');
  if(searchQuery){
    $('#search_query').val(searchQuery);
    executeSearch(searchQuery);
  }else {
    $('#search-results').append("<p>Please enter a word or phrase above</p>");
  }
});
