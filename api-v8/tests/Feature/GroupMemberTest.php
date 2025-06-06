<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GroupMemberTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJuYmYiOjE2NjgyMzE3MTksImV4cCI6MTY5OTc2NzcxOSwidWlkIjoiYmE1NDYzZjMtNzJkMS00NDEwLTg1OGUtZWFkZDEwODg0NzEzIiwiaWQiOiI0In0.LV4ItC5VCqXpbKIXT1zePcnfi-heCf3Df63w7qbXsT1i5KJtwJJC938CLgANjqwcQFa3lrR5TqvT1kkqD-Mmgg';
        $response = $this->withHeaders([
            'Authorization' => $token,
        ])->get('/api/v2/group-member?view=group&id=8079d293-5057-449f-b8b2-6482531d2434');

        $response->assertOk();
        //testing store
        $response = $this->withHeaders([
            'Authorization' => $token,
        ])->json('POST', '/api/v2/group-member',
                    [
                        'user_id'=>'61f52926-e024-41f0-8be5-48a962560a23',
                        'group_id'=>'8079d293-5057-449f-b8b2-6482531d2434',
                    ]);

        $response->assertOk();

        //testing delete
        $response = $this->withHeaders([
            'Authorization' => $token,
        ])->delete('/api/v2/group-member/134636347641171968');
        $response->assertOk();

    }

}
