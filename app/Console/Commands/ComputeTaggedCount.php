<?php

namespace App\Console\Commands;

use App\Tag;
use Illuminate\Console\Command;

class ComputeTaggedCount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'balkanmoto:compute-tagged-count';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Computes the tagged count';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $tags = Tag::all();

        $tags->each(
            function ($tag) {
                $tag->tagged_count = $tag->articles()->count();
                $tag->save();
            }
        );
    }
}
