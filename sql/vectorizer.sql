SELECT ai.create_vectorizer( 
   'tutorials'::regclass,
   name => 'tutorials_embeddings',
   loading => ai.loading_column('contents'),
   embedding => ai.embedding_ollama('nomic-embed-text', 768),
   formatting => ai.formatting_python_template('$title: $chunk'),
   destination => ai.destination_table('tutorials_contents_embeddings')
);